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
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.flushHeaders();
		const combinedInput = `Lesson: ${body.lesson}\n\nUser Request: ${body.request}`;
		const stream = await this.chatbotService.streamContent(combinedInput);

		try {
			for await (const textChunk of stream) {
				// Send each chunk as plain text followed by a delimiter
				res.write(textChunk + "\n\n");
				// Flush the response to ensure immediate transmission
				res.flushHeaders();
			}
		} catch (err) {
			res.write(`Error: ${JSON.stringify(err)}\n\n`);
		} finally {
			res.end();
		}
	}
}
