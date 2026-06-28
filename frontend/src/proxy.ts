import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const intlMiddleware = createMiddleware({
	// Supported locales
	locales: ["en", "ar"],

	// Default locale when no preference is found
	defaultLocale: "en",

	// Enforce locale prefixing
	localePrefix: "always",
});

// Initialize Ratelimiter only if credentials are provided in Env
let ratelimiter: Ratelimit | null = null;
if (
	process.env.UPSTASH_REDIS_REST_URL &&
	process.env.UPSTASH_REDIS_REST_TOKEN
) {
	const redis = new Redis({
		url: process.env.UPSTASH_REDIS_REST_URL,
		token: process.env.UPSTASH_REDIS_REST_TOKEN,
	});

	ratelimiter = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(10, "10 s"),
		analytics: true,
		prefix: "@upstash/ratelimit",
	});
}

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Edge rate limiting on specific resource-intensive API routes
	if (
		ratelimiter &&
		(pathname.startsWith("/api/chat") ||
			pathname.startsWith("/api/request-document"))
	) {
		const ip =
			request.headers.get("x-real-ip") ||
			request.headers.get("x-forwarded-for") ||
			"127.0.0.1";
		const { success, limit, reset, remaining } = await ratelimiter.limit(ip);

		if (!success) {
			return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
				status: 429,
				headers: {
					"Content-Type": "application/json",
					"x-ratelimit-limit": limit.toString(),
					"x-ratelimit-remaining": remaining.toString(),
					"x-ratelimit-reset": reset.toString(),
				},
			});
		}
	}

	// Execute next-intl routing and locale redirection
	return intlMiddleware(request);
}

export const config = {
	// Matcher to exclude internal Next.js, assets, Sentry, and API endpoints
	matcher: [
		// Match all pathnames except:
		// - API routes (except those we rate limit)
		// - Static files / assets (_next, favicon.ico, etc.)
		// - WebGL models (.glb)
		// - Files with extensions (e.g. logo.png, logo.svg)
		"/((?!api|_next/static|_next/image|favicon.ico|sentry-tunnel|models|.*\\..*).*)",
		// Rate limit routes specifically matched in proxy
		"/api/chat",
		"/api/request-document",
		// Always match root
		"/",
	],
};
