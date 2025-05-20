import { Body, Controller, Post } from "@nestjs/common";

import { ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { ChatbotService } from "./chatbot.service";

@Controller("chatbot")
export class ChatbotController {
	constructor(private readonly chatbotService: ChatbotService) {}

	@Public()
	@Post("embed")
	async embed(
		@Body() body: { question: string; answer: string; type: string },
	) {
		const response = await this.chatbotService.embedContent(body);
		return response;
	}

	@ApiOperation({ summary: "Find similar context" })
	@ApiParam({
		name: "text",
		type: String,
		description: "Text to find similar context",
	})
	@ApiBearerAuth()
	@Post("find-similar")
	async findSimilar(@Body() body: { text: string }) {
		const response = await this.chatbotService.findSimilarContext(body.text);
		return response;
	}
}
