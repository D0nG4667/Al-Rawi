import type { ChatSource } from "@/components/explore/types";
import type { HeritagePersona, HeritageSiteId } from "@/store/useUIStore";
import { DEMO_ARCHIVE } from "./demo/demoArchive.ts";
import { type DemoLocale, matchDemoAnswer } from "./demo/matchDemoAnswer.ts";

export type OracleOrigin = "live" | "demo";

export interface OracleRequest {
	query: string;
	persona: HeritagePersona;
	site: HeritageSiteId;
	locale: DemoLocale;
	apiKey?: string;
}

export interface OracleResult {
	answer: string;
	sources: ChatSource[];
	origin: OracleOrigin;
}

export interface AskOracleOptions {
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
	/** "always" forces demo answers (kiosk / pitch mode). */
	demoMode?: string;
}

export class OracleRequestError extends Error {
	status: number;

	constructor(status: number) {
		super(`Oracle request rejected with status ${status}`);
		this.name = "OracleRequestError";
		this.status = status;
	}
}

const DEFAULT_TIMEOUT_MS = 8000;

function answerFromDemo(request: OracleRequest): OracleResult {
	const match = matchDemoAnswer(
		DEMO_ARCHIVE,
		request.query,
		request.site,
		request.persona,
		request.locale,
	);
	return { answer: match.answer, sources: match.sources, origin: "demo" };
}

function parseLiveResponse(data: unknown): OracleResult | null {
	if (typeof data !== "object" || data === null) return null;
	const record = data as { answer?: unknown; sources?: unknown };
	if (typeof record.answer !== "string" || record.answer.trim() === "") {
		return null;
	}
	const rawSources: unknown[] = Array.isArray(record.sources)
		? record.sources
		: [];
	const stamp = Date.now();
	const sources: ChatSource[] = rawSources.map((raw, index) => {
		const src = (typeof raw === "object" && raw !== null ? raw : {}) as {
			metadata?: Record<string, unknown>;
			snippet?: unknown;
		};
		return {
			id: `src-${index}-${stamp}`,
			metadata: src.metadata,
			snippet: typeof src.snippet === "string" ? src.snippet : undefined,
		};
	});
	return { answer: record.answer, sources, origin: "live" };
}

/**
 * Asks the live Oracle and falls back to the curated Demo Archive on network
 * failure, timeout, 5xx, or malformed responses. 4xx responses throw
 * `OracleRequestError` so configuration problems are never hidden.
 */
export async function askOracle(
	request: OracleRequest,
	options: AskOracleOptions = {},
): Promise<OracleResult> {
	const demoMode = options.demoMode ?? process.env.NEXT_PUBLIC_DEMO_MODE;
	if (demoMode === "always") return answerFromDemo(request);

	const fetchImpl = options.fetchImpl ?? fetch;
	const controller = new AbortController();
	const timer = setTimeout(
		() => controller.abort(),
		options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
	);

	const payload: { query: string; persona: HeritagePersona; api_key?: string } =
		{ query: request.query, persona: request.persona };
	if (request.apiKey) payload.api_key = request.apiKey;

	let response: Response;
	try {
		response = await fetchImpl("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: controller.signal,
		});
	} catch {
		return answerFromDemo(request);
	} finally {
		clearTimeout(timer);
	}

	if (response.status >= 500) return answerFromDemo(request);
	if (!response.ok) throw new OracleRequestError(response.status);

	const data: unknown = await response.json().catch(() => null);
	return parseLiveResponse(data) ?? answerFromDemo(request);
}
