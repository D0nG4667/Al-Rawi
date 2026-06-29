import hashlib
import json
from typing import Any, Dict, List, Optional

from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_postgres.vectorstores import PGVector

from app.core.config import get_settings
from app.services.ingestion import get_tenant_collection_name

COLLECTION_NAME = "al_rawi_documents"


def get_tenant_cache_collection(api_key: str) -> str:
    """Generates a secure, deterministic cache collection name based on the tenant API key."""
    api_key_hash = hashlib.sha256(api_key.strip().encode("utf-8")).hexdigest()
    return f"cache_tenant_{api_key_hash[:16]}"


def get_resilient_fallback_answer(query: str) -> str:
    """Generates a graceful baseline response if all remote LLMs fail or are rate-limited."""
    return (
        f"Ahlan, welcome to Al-Rawi. The AI oracle is currently operating in high-resilience backup mode. "
        f"We are unable to process your request '{query}' via the primary AI model at the moment. Please try again shortly."
    )


async def get_semantic_cache(
    query: str,
    embeddings: GoogleGenerativeAIEmbeddings,
    database_url: str,
    collection_name: str,
) -> Optional[Dict[str, Any]]:
    """Checks if a highly similar query answer exists in the PGVector semantic cache."""
    if not database_url:
        return None
    try:
        vectorstore = PGVector(
            embeddings=embeddings,
            collection_name=collection_name,
            connection=database_url,
            use_jsonb=True,
        )
        results = vectorstore.similarity_search_with_score(query, k=1)
        if results:
            doc, score = results[0]
            # Cosine distance: <= 0.08 indicates highly similar query
            if score <= 0.08:
                data = json.loads(doc.metadata["response_data"])
                data["cached"] = True
                return data
    except Exception as e:
        print(f"[-] Semantic cache lookup error: {e}")
    return None


async def set_semantic_cache(
    query: str,
    answer_data: Dict[str, Any],
    embeddings: GoogleGenerativeAIEmbeddings,
    database_url: str,
    collection_name: str,
) -> None:
    """Stores query response payload in the PGVector semantic cache."""
    if not database_url:
        return
    try:
        vectorstore = PGVector(
            embeddings=embeddings,
            collection_name=collection_name,
            connection=database_url,
            use_jsonb=True,
        )
        cache_payload = dict(answer_data)
        cache_payload["cached"] = True

        doc = Document(
            page_content=query,
            metadata={"response_data": json.dumps(cache_payload)},
        )
        vectorstore.add_documents([doc])
    except Exception as e:
        print(f"[-] Semantic cache store error: {e}")


async def retrieve_rag_context(
    query: str,
    embeddings: GoogleGenerativeAIEmbeddings,
    database_url: str,
    collection_name: str,
) -> List[Dict[str, Any]]:
    """Retrieves document chunks matching the semantic query from Neon PostgreSQL."""
    vectorstore = PGVector(
        embeddings=embeddings,
        collection_name=collection_name,
        connection=database_url,
        use_jsonb=True,
    )
    # k=5 nearest neighbors
    docs = vectorstore.similarity_search(query, k=5)
    return docs


def compress_retrieved_documents(docs: List[Any]) -> str:
    """Filters duplicate chunks and consolidates context to optimize prompt context window."""
    seen_contents = set()
    compressed_text = []

    for doc in docs:
        content = doc.page_content.strip()
        # Create a signature/short digest to avoid identical text sections
        sig = content[:150]
        if sig not in seen_contents:
            seen_contents.add(sig)
            compressed_text.append(content)

    return "\n\n".join(compressed_text)


async def execute_chat_query(
    query: str, api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Processes RAG queries using semantic caching, vector retrieval, and model failovers."""
    settings = get_settings()

    # 1. Setup Embeddings Model
    google_key = api_key or settings.GOOGLE_API_KEY
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", google_api_key=google_key
    )

    # 2. Semantic Cache Lookup
    tenant_cache_collection = get_tenant_cache_collection(google_key)
    cached_response = await get_semantic_cache(
        query, embeddings, settings.DATABASE_URL, tenant_cache_collection
    )
    if cached_response:
        return cached_response

    # 3. Vector Database Retrieval
    docs = []
    if settings.DATABASE_URL:
        try:
            tenant_collection = get_tenant_collection_name(google_key)
            docs = await retrieve_rag_context(
                query, embeddings, settings.DATABASE_URL, tenant_collection
            )
        except Exception as e_db:
            print(f"[-] Database vector retrieval error: {e_db}")

    # 4. Context Compression
    context = compress_retrieved_documents(docs)

    # 5. Formulate Prompt
    prompt = (
        "You are Al-Rawi, the Saudi Heritage & Tourism AI Oracle.\n"
        "Use the following context to answer the user question. If the context doesn't contain the answer, "
        "use your knowledge about Saudi heritage to answer, but state clearly that it is from general knowledge.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {query}\n"
        "Answer:"
    )

    # 6. LLM Execution with Failovers
    answer = ""
    model_used = "Gemini 2.5 Flash"

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", google_api_key=google_key, temperature=0.2
        )
        response = await llm.ainvoke(prompt)
        answer = response.content
    except Exception as e_gemini:
        print(f"[-] Gemini LLM execution failed: {e_gemini}. Attempting failover...")
        if settings.OPENAI_API_KEY:
            try:
                from langchain_openai import ChatOpenAI

                llm = ChatOpenAI(
                    model="gpt-4o-mini",
                    api_key=settings.OPENAI_API_KEY,
                    temperature=0.2,
                )
                model_used = "GPT-4o Mini (Failover)"
                response = await llm.ainvoke(prompt)
                answer = response.content
            except Exception as e_openai:
                print(f"[-] OpenAI failover failed: {e_openai}. Falling back...")
                model_used = "Resilience Engine"
                answer = get_resilient_fallback_answer(query)
        else:
            model_used = "Resilience Engine"
            answer = get_resilient_fallback_answer(query)

    # Assemble Sources metadata
    sources = []
    for doc in docs:
        sources.append(
            {
                "metadata": doc.metadata,
                "snippet": doc.page_content[:200] + "...",
            }
        )

    response_payload = {
        "answer": answer,
        "sources": sources,
        "model_used": model_used,
        "cached": False,
    }

    # 7. Update cache
    await set_semantic_cache(
        query,
        response_payload,
        embeddings,
        settings.DATABASE_URL,
        tenant_cache_collection,
    )

    return response_payload
