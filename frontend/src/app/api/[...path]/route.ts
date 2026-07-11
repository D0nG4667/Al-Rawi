import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

async function handleProxy(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const pathStr = path.join("/");

	// Skip auth requests to let next-auth / neon auth handle them
	if (pathStr.startsWith("auth")) {
		return new NextResponse("Not Found", { status: 404 });
	}

	const searchParams = request.nextUrl.search;
	const targetUrl = `${BACKEND_URL}/api/v1/${pathStr}${searchParams}`;

	const headers = new Headers(request.headers);
	headers.set("host", new URL(BACKEND_URL).host);

	try {
		// Read body safely for methods that carry payload
		let body: ArrayBuffer | undefined;
		if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
			body = await request.arrayBuffer();
		}

		const response = await fetch(targetUrl, {
			method: request.method,
			headers,
			body,
			duplex: "half",
		} as RequestInit & { duplex: string });

		const responseHeaders = new Headers(response.headers);
		responseHeaders.delete("content-encoding");

		return new NextResponse(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error(`[-] Proxy forwarding failed for ${targetUrl}:`, error);
		return new NextResponse(
			JSON.stringify({ error: "Proxy connection failed" }),
			{
				status: 502,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
