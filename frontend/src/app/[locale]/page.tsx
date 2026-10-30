import ExploreDashboard from "@/components/ui/ExploreDashboard";
import SupportButton from "@/components/ui/SupportButton";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<main className="relative min-h-[200vh]">
			<SupportButton />
			<ExploreDashboard locale={locale} />
		</main>
	);
}
