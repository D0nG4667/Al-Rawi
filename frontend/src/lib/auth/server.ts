import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
	baseUrl: process.env.NEON_AUTH_BASE_URL || "https://oauth.neon.tech",
	cookies: {
		// Secret must be at least 32 characters
		secret:
			process.env.NEON_AUTH_COOKIE_SECRET ||
			"default_secret_32_characters_long_for_neon_auth",
	},
});
