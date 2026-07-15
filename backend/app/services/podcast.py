from typing import Any, Dict, List, Optional

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.core.config import get_settings
from app.services.chat import compress_retrieved_documents, retrieve_rag_context
from app.services.ingestion import get_tenant_collection_name


# Pydantic models for structured output validation
class DialogueLine(BaseModel):
    speaker: str = Field(
        description="The name of the speaker, either 'Visitor' (Curious Visitor) or 'Rawi' (Al-Rawi the Oracle)"
    )
    text: str = Field(
        description="The dialogue spoken by the speaker. Can be in English or Arabic depending on context."
    )


class PodcastScript(BaseModel):
    title: str = Field(description="Title of the podcast episode")
    dialogue: List[DialogueLine] = Field(
        description="The chronological sequence of dialogue lines"
    )


# Define the structured agent utilizing Gemini 2.5 Flash
podcast_agent = Agent(
    "google:gemini-2.5-flash",
    output_type=PodcastScript,
    system_prompt=(
        "You are an expert bilingual podcaster and Saudi heritage historian. "
        "Draft an engaging, conversational, two-speaker podcast dialogue between: "
        "1. 'Visitor' (a curious tourist asking questions in English) "
        "2. 'Rawi' (Al-Rawi the Oracle, answering questions with rich historical depth, speaking in English or Arabic depending on context, using beautiful Arabic lines when conveying heritage quotes or traditional phrases). "
        "Create a script of 6 to 10 dialogue lines based on the provided context. Make the conversation natural and historically accurate."
    ),
)


async def generate_podcast_script(
    query: Optional[str] = None, api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Retrieves document chunks matching the query and drafts a structured podcast script dialogue."""
    settings = get_settings()
    google_key = api_key or settings.GOOGLE_API_KEY

    # 1. Setup Embeddings Model
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", google_api_key=google_key
    )

    # 2. Retrieve context from tenant collection
    docs = []
    if settings.DATABASE_URL:
        try:
            tenant_collection = get_tenant_collection_name(google_key)
            search_query = (
                query
                or "Saudi Arabia UNESCO world heritage landmarks history architecture Diriyah Al-Ula"
            )
            docs = await retrieve_rag_context(
                search_query, embeddings, settings.DATABASE_URL, tenant_collection
            )
        except Exception as e:
            print(f"[-] Podcast vector retrieval failed: {e}")

    context = compress_retrieved_documents(docs)

    # 3. Call Pydantic AI Agent
    try:
        prompt = (
            f"Please draft a podcast script for the topic/query: '{query or 'General Overview'}'.\n"
            f"Use the following context to make it rich, historically accurate, and engaging:\n\n{context}"
        )
        result = await podcast_agent.run(prompt)
        script_data: PodcastScript = result.output
        return script_data.model_dump()
    except Exception as e_agent:
        print(f"[-] Pydantic AI podcast generation failed: {e_agent}")
        # Return a fallback script
        return {
            "title": f"Saudi Heritage: {query or 'Overview'}",
            "dialogue": [
                {
                    "speaker": "Visitor",
                    "text": "Hello Oracle! Can you tell me about the historical significance of this heritage site?",
                },
                {
                    "speaker": "Rawi",
                    "text": "مرحباً بك. Yes, this place carries hundreds of years of rich history and cultural identity of the Kingdom.",
                },
                {
                    "speaker": "Visitor",
                    "text": "That is fascinating! What architectural features stand out the most here?",
                },
                {
                    "speaker": "Rawi",
                    "text": "The traditional mud-brick design, particularly the Najdi architectural style, with its visual triangle patterns and functional ventilation.",
                },
            ],
        }
