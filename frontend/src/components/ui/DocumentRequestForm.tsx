"use client";

import { Globe, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

interface DocumentRequestFormProps {
	apiKey?: string;
}

export default function DocumentRequestForm({
	apiKey,
}: DocumentRequestFormProps): React.ReactElement {
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
		} catch {
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
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="doc-url"
					className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"
				>
					<Globe className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
					Remote UNESCO / Archival Dossier URL
				</label>
				<input
					id="doc-url"
					type="url"
					placeholder="https://whc.unesco.org/document/hegra-dossier.pdf"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					disabled={status === "loading"}
					className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-strong)] rounded-xl px-3.5 py-2.5 w-full text-xs outline-none transition-colors disabled:opacity-50 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
				/>
			</div>

			<button
				type="submit"
				disabled={status === "loading"}
				className="w-full heritage-chip rounded-xl py-2.5 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
			>
				<Send className="w-3.5 h-3.5" />
				{status === "loading" ? "Submitting..." : "Submit Ingestion Request"}
			</button>

			{feedback && (
				<p
					className={`text-xs leading-relaxed ${
						status === "success"
							? "text-[var(--accent-oasis)]"
							: "text-[var(--accent-terracotta)]"
					}`}
				>
					{feedback}
				</p>
			)}
		</form>
	);
}
