import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { Public } from "src/decorators/public-route";

import { ChatbotService } from "./chatbot.service";

@Controller("chatbot")
export class ChatbotController {
	constructor(private readonly chatbotService: ChatbotService) {}

	@Post("stream")
	@Public()
	async stream(
		@Body() body: { lesson: string; request: string },
		@Res() res: Response,
	) {
		// Set appropriate headers for streaming
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Content-Type-Options", "nosniff");
		// Remove Transfer-Encoding as it can cause issues in some environments
		res.flushHeaders();

		const combinedInput = `Lesson: ${body.lesson}\n\nUser Request: ${body.request}`;
		const stream = await this.chatbotService.streamContent(combinedInput);

		// Set up a timer to periodically send chunks
		// This ensures chunks are sent even if the flush method isn't available
		let buffer = "";

		try {
			for await (const textChunk of stream) {
				if (textChunk) {
					// Add to buffer and send immediately
					buffer += textChunk;
					res.write(`${textChunk}\n\n`);

					// Calling flushHeaders can help trigger sending in some Express setups
					res.flushHeaders();
				}
			}

			// Send any remaining buffer
			if (buffer) {
				res.write("\n\n");
			}
		} catch (err) {
			console.error("Streaming error:", err);
			res.write(`Error: ${JSON.stringify(err)}\n\n`);
		} finally {
			res.end();
		}
	}
}
