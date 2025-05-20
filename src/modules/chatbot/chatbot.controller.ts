import { Body, Controller, Post } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
} from "@nestjs/swagger";

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

	@Public()
	@ApiOperation({ summary: "Find similar context" })
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				text: { type: "string" },
			},
		},
	})
	@ApiBearerAuth()
	@Post("find-similar")
	async findSimilar(@Body("text") text: string) {
		const response = await this.chatbotService.findSimilarContext(text);
		return response;
	}
}
