import ExploreDashboard from "@/components/ui/ExploreDashboard";
import SupportButton from "@/components/ui/SupportButton";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
	const { locale } = await params;

	return (
		<main className="relative h-dvh overflow-hidden">
			<SupportButton />
			<ExploreDashboard locale={locale} />
		</main>
	);
}
