import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

export const authClient = createAuthClient(
	process.env.NEXT_PUBLIC_NEON_AUTH_URL || "http://localhost:3000/api/auth",
	{
		adapter: BetterAuthReactAdapter(),
		allowAnonymous: true,
	},
);
