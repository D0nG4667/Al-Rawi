import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	turbopack: {
		root: process.cwd(),
	},
};

export default withSentryConfig(withNextIntl(nextConfig), {
	// For all available options, see:
	// https://github.com/getsentry/sentry-javascript/blob/master/packages/nextjs/src/config/types.ts

	// Suppression of Sentry CLI logs
	silent: true,
	org: "al-rawi",
	project: "frontend",
});
