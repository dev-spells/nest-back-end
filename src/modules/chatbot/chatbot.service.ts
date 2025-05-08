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
			systemInstruction: [
				{
					text: `fdsafsdafdsa`, // Replace with your actual system prompt
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
			for await (const chunk of response) {
				if (chunk.text !== undefined) {
					yield chunk.text;
				}
			}
		}

		return streamChunks();
	}
}
