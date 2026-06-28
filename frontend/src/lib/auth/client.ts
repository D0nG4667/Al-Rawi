import { BetterAuthReactAdapter, createAuthClient } from "@neondatabase/auth";

export const authClient = createAuthClient(
	process.env.NEXT_PUBLIC_NEON_AUTH_URL || "http://localhost:3000/api/auth",
	{
		adapter: BetterAuthReactAdapter(),
		allowAnonymous: true,
	},
);
