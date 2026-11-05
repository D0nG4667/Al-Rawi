import { GraduationCap, Landmark, Plane } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type React from "react";
import Reveal from "@/components/landing/Reveal";

const AUDIENCES = [
	{ id: "audienceAuthority", Icon: Landmark },
	{ id: "audienceOperator", Icon: Plane },
	{ id: "audienceVisitor", Icon: GraduationCap },
] as const;

export default async function AudienceCards(): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");

	return (
		<section
			aria-labelledby="audience-title"
			className="px-6 py-24 max-w-6xl mx-auto w-full"
		>
			<Reveal className="text-center mb-12">
				<h2
					id="audience-title"
					className="font-display text-3xl sm:text-4xl font-bold"
				>
					{t("audienceTitle")}
				</h2>
			</Reveal>
			<div className="grid gap-6 md:grid-cols-3">
				{AUDIENCES.map(({ id, Icon }, index) => (
					<Reveal key={id} delay={index * 0.08}>
						<div className="glass-panel h-full p-6 space-y-3 border border-[var(--border-subtle)]">
							<Icon
								className="w-6 h-6 text-[var(--accent-terracotta)]"
								aria-hidden="true"
							/>
							<h3 className="font-display text-lg font-bold">
								{t(`${id}Title`)}
							</h3>
							<p className="text-sm text-[var(--text-secondary)] leading-relaxed">
								{t(`${id}Body`)}
							</p>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
