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
		res.setHeader("Content-Type", "text/plain");
		const combinedInput = `Lesson: ${body.lesson}\n\nUser Request: ${body.request}`;
		const stream = await this.chatbotService.streamContent(combinedInput);

		for await (const textChunk of stream) {
			res.write(textChunk);
		}

		res.end();
	}
}
