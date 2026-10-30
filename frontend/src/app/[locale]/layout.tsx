import type { Metadata } from "next";
import {
	Fraunces,
	IBM_Plex_Mono,
	IBM_Plex_Sans_Arabic,
	Reem_Kufi,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "../globals.css";

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	display: "swap",
});

const reemKufi = Reem_Kufi({
	variable: "--font-reem-kufi",
	subsets: ["arabic", "latin"],
	weight: ["500", "600", "700"],
	display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
	variable: "--font-plex-arabic",
	subsets: ["arabic", "latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Al-Rawi · الراوي — Saudi Heritage & AI Oracle",
	description:
		"Illuminated spatial archive and AI Oracle for Saudi Arabia's UNESCO World Heritage Sites in Ad-Dir'iyah, AlUla, and Historic Jeddah.",
};

export function generateStaticParams(): Array<{ locale: string }> {
	return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>): Promise<React.ReactElement> {
	const { locale } = await params;

	// Validate that the incoming locale is supported
	if (!["en", "ar"].includes(locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Get translation messages for this locale
	const messages = await getMessages();

	const direction = locale === "ar" ? "rtl" : "ltr";

	return (
		<html
			lang={locale}
			dir={direction}
			data-theme="night"
			className={`${fraunces.variable} ${reemKufi.variable} ${plexArabic.variable} ${plexMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body
				className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]"
				suppressHydrationWarning
			>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						<SmoothScrollProvider>{children}</SmoothScrollProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
