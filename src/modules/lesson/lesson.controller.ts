import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
} from "@nestjs/swagger";

import { LESSON_ERRORS } from "src/constants/errors";
import { Role } from "src/constants/role.enum";
import { Roles } from "src/decorators/role-route";
import { OnlyOneExercisePipe } from "src/pipe/exercise-validation.pipe";

import { CreateLessonDto } from "./dto/create-lesson.dto";
import { LessonResponseDto } from "./dto/response-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

@Controller("lesson")
export class LessonController {
	constructor(private readonly lessonService: LessonService) {}

	@ApiOperation({ summary: "Create a lesson - ADMIN" })
	@ApiBearerAuth()
	@ApiCreatedResponse()
	@ApiBadRequestResponse({
		description: "One exercise type must be provided or invalid data",
	})
	@Post()
	@Roles(Role.ADMIN)
	create(@Body(OnlyOneExercisePipe) createLessonDto: CreateLessonDto) {
		return this.lessonService.create(createLessonDto);
	}

	@ApiOperation({
		summary: "Get lesson detail",
		description:
			"If there is one exercise data appears, 2 remain will be null.",
	})
	@ApiBearerAuth()
	@ApiOkResponse({ type: LessonResponseDto })
	@ApiBadRequestResponse({ description: LESSON_ERRORS.NOT_FOUND })
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.lessonService.findOne(+id);
	}

	@ApiOperation({ summary: "Update lessons - ADMIN" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiBadRequestResponse({ description: LESSON_ERRORS.NOT_FOUND })
	@Roles(Role.ADMIN)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateLessonDto: UpdateLessonDto) {
		return this.lessonService.update(+id, updateLessonDto);
	}

	@ApiOperation({ summary: "Hard delete lesson - ADMIN" })
	@ApiOkResponse()
	@ApiBadRequestResponse({ description: LESSON_ERRORS.NOT_FOUND })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.lessonService.remove(+id);
	}
}
