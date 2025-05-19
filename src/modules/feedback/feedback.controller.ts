import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import aqp from "api-query-params";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Public } from "src/decorators/public-route";
import { Roles } from "src/decorators/role-route";
import {
	FeedbackStatus,
	FeedbackType,
} from "src/entities/user-feedback.entity";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { GetFeedbackResponse } from "./dto/response-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { FeedbackService } from "./feedback.service";

@ApiTags("Feedback")
@Controller("feedback")
export class FeedbackController {
	constructor(private readonly feedbackService: FeedbackService) {}

	@ApiOperation({ summary: "create feedback" })
	@ApiBadRequestResponse({ description: "Query invalid" })
	@ApiBearerAuth()
	@Post()
	create(@User() user: any, @Body() createFeedbackDto: CreateFeedbackDto) {
		return this.feedbackService.create(user.id, createFeedbackDto);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "get all feedbacks" })
	@ApiOkResponse({ type: GetFeedbackResponse })
	@ApiBadRequestResponse({ description: "Query invalid" })
	@ApiQuery({
		name: "pageSize",
		required: false,
		description: "Number of record each page",
	})
	@ApiQuery({ name: "current", required: false, description: "Current page" })
	@ApiQuery({
		name: "sort",
		required: false,
		description: "sort by",
		example: "-createdAt",
	})
	@ApiQuery({
		name: "q",
		required: false,
		description: "filter by feedback",
	})
	@ApiQuery({
		name: "feedbackType",
		required: false,
		description: "filter by feedback type",
		enum: FeedbackType,
	})
	@ApiQuery({
		name: "status",
		required: false,
		description: "filter by feedback status",
		enum: FeedbackStatus,
	})
	@Public()
	@Get()
	findAll(@Query() query: string) {
		const { filter, sort } = aqp(query);
		if (!filter.current) filter.current = 1;
		if (!filter.pageSize) filter.pageSize = 10;

		return this.feedbackService.findAll({ filter, sort });
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "update feedback" })
	@ApiBearerAuth()
	@ApiNotFoundResponse({ description: "Feedback not found" })
	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateFeedbackDto: UpdateFeedbackDto,
	) {
		return this.feedbackService.update(+id, updateFeedbackDto);
	}
}
