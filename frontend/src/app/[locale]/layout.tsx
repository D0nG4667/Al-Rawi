import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Al-Rawi - Heritage & Tourism",
	description:
		"Preserving and exploring historical architectures in Saudi Arabia",
};

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
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
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body
				className="min-h-full flex flex-col bg-[#0B0C10] text-gray-200"
				suppressHydrationWarning
			>
				<NextIntlClientProvider messages={messages}>
					<SmoothScrollProvider>{children}</SmoothScrollProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
