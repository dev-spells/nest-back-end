import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class ChatbotService {
	private readonly ai: GoogleGenAI;

	constructor(private readonly configService: ConfigService) {
		this.ai = new GoogleGenAI({
			apiKey: configService.get("GEMINI_API_KEY"),
		});
	}

	async streamContent(
		userInput: string,
	): Promise<AsyncGenerator<string, void, unknown>> {
		const config = {
			responseMimeType: "text/plain",
			streamMode: "streaming", // Ensure streaming mode is enabled
			systemInstruction: [
				{
					text: `You are Elder Racoon, a wise and helpful assistant. Respond to user questions with relevant information.`, // Replace with your actual system prompt
				},
			],
		};

		const model = "gemini-2.0-flash-lite";
		const contents = [
			{
				role: "user",
				parts: [
					{
						text: userInput,
					},
				],
			},
		];

		const response = await this.ai.models.generateContentStream({
			model,
			config,
			contents,
		});

		async function* streamChunks() {
			try {
				for await (const chunk of response) {
					if (chunk.text !== undefined && chunk.text.length > 0) {
						yield chunk.text;
					}
				}
			} catch (error) {
				console.error("Error in streamChunks:", error);
				throw error;
			}
		}

		return streamChunks();
	}
}
