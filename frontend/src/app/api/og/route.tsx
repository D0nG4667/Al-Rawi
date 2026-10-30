import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url);

		const title = searchParams.get("title") || "Al-Rawi · الراوي";
		const subtitle =
			searchParams.get("subtitle") || "Illuminated Saudi Heritage & AI Oracle";

		return new ImageResponse(
			<div
				style={{
					display: "flex",
					height: "100%",
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					background: "#0E1020",
					padding: "48px",
					border: "4px solid rgba(217, 164, 65, 0.35)",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						background: "rgba(26, 30, 52, 0.9)",
						border: "2px solid rgba(217, 164, 65, 0.45)",
						borderRadius: "24px",
						padding: "64px 88px",
						textAlign: "center",
						boxShadow: "0 20px 50px rgba(4, 6, 16, 0.7)",
					}}
				>
					<div
						style={{
							fontSize: "16px",
							letterSpacing: "0.25em",
							textTransform: "uppercase",
							color: "#D9A441",
							marginBottom: "16px",
						}}
					>
						UNESCO ARCHIVAL CHRONICLE · SAUDI ARABIA
					</div>
					<h1
						style={{
							fontSize: "64px",
							fontWeight: "bold",
							color: "#F5EFE6",
							marginBottom: "20px",
							letterSpacing: "0.04em",
						}}
					>
						{title}
					</h1>
					<p
						style={{
							fontSize: "24px",
							color: "#B8AEA0",
							maxWidth: "680px",
							lineHeight: "1.45",
						}}
					>
						{subtitle}
					</p>
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	} catch {
		return new Response("Failed to generate the image", {
			status: 500,
		});
	}
}
