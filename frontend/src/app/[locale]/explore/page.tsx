import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ExploreDashboard from "@/components/ui/ExploreDashboard";
import SupportButton from "@/components/ui/SupportButton";
import { parseExploreParams, type RawSearchParams } from "@/lib/exploreParams";

interface ExplorePageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
	params,
}: Pick<ExplorePageProps, "params">): Promise<Metadata> {
	const { locale } = await params;
	return locale === "ar"
		? {
				title: "استكشف · الراوي",
				description:
					"استكشف حي الطريف والحِجر وجدة التاريخية في مشهد ثلاثي الأبعاد واسأل الراوي.",
			}
		: {
				title: "Explore · Al-Rawi",
				description:
					"Explore At-Turaif, Hegra and Historic Jeddah in 3D and ask the Al-Rawi Oracle.",
			};
}

export default async function ExplorePage({
	params,
	searchParams,
}: ExplorePageProps): Promise<React.ReactElement> {
	const { locale } = await params;
	setRequestLocale(locale);
	const initialParams = parseExploreParams(await searchParams);

	return (
		<main className="relative h-dvh overflow-hidden">
			<SupportButton />
			<ExploreDashboard locale={locale} initialParams={initialParams} />
		</main>
	);
}
