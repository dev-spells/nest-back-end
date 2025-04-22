import { Body, Controller, Param, Post } from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { User } from "src/decorators/current-user";

import { CreateUserSubmissionDto } from "./dto/create-user-submission.dto";
import {
	FinishCourseReponseDto,
	SubmitLessonResponseDto,
} from "./dto/response-user-submission.dto";
import { UserSubmissionService } from "./user-submission.service";

@ApiTags("User Submission")
@Controller("user-submission")
export class UserSubmissionController {
	constructor(private readonly userSubmissionService: UserSubmissionService) {}

	@ApiOperation({ summary: "Handle user submission" })
	@ApiBearerAuth()
	@ApiCreatedResponse({ type: SubmitLessonResponseDto })
	@ApiNotFoundResponse({ description: "User/Lesson/Exercise not found" })
	@Post()
	async handleUserSubmission(
		@User() user: any,
		@Body() createUserSubmissionDto: CreateUserSubmissionDto,
	) {
		return this.userSubmissionService.handleSubmissionLogic(
			user.id,
			createUserSubmissionDto,
		);
	}

	@ApiOperation({ summary: "Check if course is complete" })
	@ApiBearerAuth()
	@ApiOkResponse({
		type: FinishCourseReponseDto,
	})
	@ApiBadRequestResponse({ description: "User already finished course" })
	@ApiNotFoundResponse({ description: "User/Course not found" })
	@Post("course/:courseId")
	async isCourseComplete(
		@User() user: any,
		@Param("courseId") courseId: number,
	) {
		return this.userSubmissionService.isCourseComplete(user.id, courseId);
	}
}
