import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
	// Supported locales
	locales: ["en", "ar"],

	// Default locale when no preference is found
	defaultLocale: "en",

	// Enforce locale prefixing
	localePrefix: "always",
});

export async function proxy(request: NextRequest) {
	// Execute next-intl routing and locale redirection
	return intlMiddleware(request);
}

export const config = {
	// Matcher to exclude internal Next.js, assets, Sentry, and API endpoints
	matcher: [
		// Match all pathnames except:
		// - API routes (/api)
		// - Static files / assets (_next, favicon.ico, etc.)
		// - WebGL models (.glb)
		// - Files with extensions (e.g. logo.png, logo.svg)
		"/((?!api|_next/static|_next/image|favicon.ico|sentry-tunnel|models|.*\\..*).*)",
		// Always match root
		"/",
	],
};
