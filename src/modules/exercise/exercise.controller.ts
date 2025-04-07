import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiExcludeEndpoint,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { Public } from "src/decorators/public-route";
import { Roles } from "src/decorators/role-route";

import {
	UpdateCodingExerciseDto,
	UpdateMultipleChoiceExerciseDto,
	UpdateQuizExerciseDto,
} from "./dto/update-exercise.dto";
import { CodingExerciseService } from "./coding-exercise.service";
import { MultipleChoiceExerciseService } from "./multiple-choice-exercise.service";
import { QuizExerciseService } from "./quiz-exercise.service";

@Controller("exercise")
export class ExerciseController {
	constructor(
		private readonly codingExerciseService: CodingExerciseService,
		private readonly multipleChoiceExerciseService: MultipleChoiceExerciseService,
		private readonly quizExerciseService: QuizExerciseService,
	) {}

	@ApiExcludeEndpoint()
	@Public()
	@Post("test")
	async test() {
		const mockQuiz = {
			question: "What is the capital of France?",
			answer: "Paris",
		};
		return await this.quizExerciseService.create(mockQuiz);
	}

	@ApiOperation({ summary: "Update a multiple choice exercise - ADMIN" })
	@ApiNotFoundResponse({ description: "Exercise not found" })
	@ApiOkResponse({ description: "Exercise updated successfully" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Patch("multiple-choices/:id")
	async updateMultipleChoiceExercise(
		@Param("id") id: number,
		@Body() updateMultipleChoiceExerciseDto: UpdateMultipleChoiceExerciseDto,
	) {
		return await this.multipleChoiceExerciseService.update(
			id,
			updateMultipleChoiceExerciseDto,
		);
	}

	@ApiOperation({ summary: "Update a quiz exercise - ADMIN" })
	@ApiNotFoundResponse({ description: "Exercise not found" })
	@ApiOkResponse({ description: "Exercise updated successfully" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Patch("quiz/:id")
	async updateQuizExercise(
		@Param("id") id: number,
		@Body() updateQuizExerciseDto: UpdateQuizExerciseDto,
	) {
		return await this.quizExerciseService.update(id, updateQuizExerciseDto);
	}

	@ApiOperation({ summary: "Update a coding exercise - ADMIN" })
	@ApiNotFoundResponse({ description: "Exercise not found" })
	@ApiOkResponse({ description: "Exercise updated successfully" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Patch("coding/:id")
	async updateCodingExercise(
		@Param("id") id: number,
		@Body() updateCodingExerciseDto: UpdateCodingExerciseDto,
	) {
		return await this.codingExerciseService.update(id, updateCodingExerciseDto);
	}

	@ApiOperation({ summary: "Update a coding snippet - ADMIN" })
	@ApiNotFoundResponse({ description: "Exercise not found" })
	@ApiOkResponse({ description: "Exercise updated successfully" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Patch("coding-snippet/:id")
	async updateCodingSnippet(
		@Param("id") id: number,
		@Body() updateCodingExerciseDto: UpdateCodingExerciseDto,
	) {
		return await this.codingExerciseService.update(id, updateCodingExerciseDto);
	}

	@ApiOperation({ summary: "Delete a coding snippet exercise - ADMIN" })
	@ApiNotFoundResponse({ description: "Exercise not found" })
	@ApiOkResponse({ description: "Exercise deleted successfully" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Delete("coding-snippet/:id")
	async deleteCodingSnippet(@Param("id") id: number) {
		return await this.codingExerciseService.deleteCodingSnippet(id);
	}
}
