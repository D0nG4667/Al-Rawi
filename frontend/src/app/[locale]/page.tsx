import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type React from "react";
import AudienceCards from "@/components/landing/AudienceCards";
import CapabilityScroll from "@/components/landing/CapabilityScroll";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import SiteTriptych from "@/components/landing/SiteTriptych";
import TrustBand from "@/components/landing/TrustBand";

interface LandingPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({
	params,
}: LandingPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Landing" });
	return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function LandingPage({
	params,
}: LandingPageProps): Promise<React.ReactElement> {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<main className="relative min-h-dvh overflow-x-hidden">
			<LandingHero locale={locale} />
			<SiteTriptych locale={locale} />
			<CapabilityScroll />
			<TrustBand />
			<AudienceCards />
			<LandingFooter locale={locale} />
		</main>
	);
}
