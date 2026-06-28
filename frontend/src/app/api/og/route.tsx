import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Dynamic parameters parsed from request URL
		const title = searchParams.get("title") || "Al-Rawi | الراوي";
		const subtitle =
			searchParams.get("subtitle") ||
			"Saudi Architectural Heritage & AI Oracle";

		return new ImageResponse(
			<div
				style={{
					display: "flex",
					height: "100%",
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					background: "#0B0C10",
					padding: "40px",
					border: "4px solid rgba(255, 255, 255, 0.1)",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						background: "rgba(255, 255, 255, 0.03)",
						border: "1px solid rgba(255, 255, 255, 0.1)",
						borderRadius: "20px",
						padding: "60px 80px",
						textAlign: "center",
						boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
					}}
				>
					<h1
						style={{
							fontSize: "64px",
							fontWeight: "bold",
							color: "#ffffff",
							marginBottom: "20px",
							letterSpacing: "0.05em",
						}}
					>
						{title}
					</h1>
					<p
						style={{
							fontSize: "24px",
							color: "rgba(255, 255, 255, 0.7)",
							maxWidth: "600px",
							lineHeight: "1.4",
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
	} catch (e: any) {
		return new Response("Failed to generate the image", {
			status: 500,
		});
	}
}
