export interface ChatSource {
	id: string;
	metadata?: Record<string, unknown>;
	snippet?: string;
}

export interface ChatMessage {
	id: string;
	role: "user" | "oracle";
	text: string;
	sources?: ChatSource[];
	isNew?: boolean;
}

export interface UploadedDoc {
	name: string;
	chunks: number;
}

export interface DialogueLine {
	id: string;
	speaker: string;
	text: string;
}

export interface PodcastScript {
	title: string;
	dialogue: DialogueLine[];
}
