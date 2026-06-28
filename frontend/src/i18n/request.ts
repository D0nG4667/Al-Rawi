import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	// Await requestLocale and fallback to "en" if undefined
	const resolvedLocale = (await requestLocale) || "en";

	return {
		locale: resolvedLocale,
		messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
	};
});
