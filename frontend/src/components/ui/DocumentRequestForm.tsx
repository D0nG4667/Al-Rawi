"use client";

import { type FormEvent, useState } from "react";

interface DocumentRequestFormProps {
	apiKey?: string;
}

export default function DocumentRequestForm({
	apiKey,
}: DocumentRequestFormProps) {
	const [url, setUrl] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [feedback, setFeedback] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		if (!url) {
			setStatus("error");
			setFeedback("Please enter a valid URL.");
			return;
		}

		try {
			new URL(url);
		} catch (_) {
			setStatus("error");
			setFeedback("Please enter a fully qualified URL (e.g., https://...)");
			return;
		}

		setStatus("loading");
		setFeedback("");

		try {
			const res = await fetch("/api/request-document", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url,
					...(apiKey ? { api_key: apiKey } : {}),
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to submit request.");
			}

			setStatus("success");
			setFeedback("Document request submitted successfully for ingestion!");
			setUrl("");
		} catch (error) {
			setStatus("error");
			const errorMessage =
				error instanceof Error ? error.message : "Failed to submit request.";
			setFeedback(errorMessage);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<label htmlFor="doc-url" className="text-xs font-semibold opacity-70">
					Document URL
				</label>
				<input
					id="doc-url"
					type="url"
					placeholder="https://example.com/heritage-doc.pdf"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					disabled={status === "loading"}
					className="bg-black/50 border border-white/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-white/30 transition-colors disabled:opacity-50"
				/>
			</div>

			<button
				type="submit"
				disabled={status === "loading"}
				className="w-full bg-white/10 text-white hover:bg-white/20 active:scale-98 transition-all border border-white/25 rounded-lg py-2.5 font-medium text-sm shadow-[0_2px_10px_rgba(0,0,0,0.3)] disabled:opacity-50"
			>
				{status === "loading" ? "Submitting..." : "Submit Ingestion Request"}
			</button>

			{feedback && (
				<p
					className={`text-xs mt-1 leading-relaxed ${
						status === "success" ? "text-green-400" : "text-red-400"
					}`}
				>
					{feedback}
				</p>
			)}
		</form>
	);
}
