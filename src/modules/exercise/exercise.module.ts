import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CodingExercise } from "src/entities/coding-exercise.entity";
import { CodingExerciseSnippet } from "src/entities/coding-exercise-snippet.entity";
import { MultipleChoiceExercise } from "src/entities/multiple-choice-exercise.entity";
import { QuizExercise } from "src/entities/quiz-exercise.entity";

import { CodingExerciseService } from "./coding-exercise.service";
import { ExerciseController } from "./exercise.controller";
import { MultipleChoiceExerciseService } from "./multiple-choice-exercise.service";
import { QuizExerciseService } from "./quiz-exercise.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			QuizExercise,
			MultipleChoiceExercise,
			CodingExercise,
			CodingExerciseSnippet,
		]),
	],
	controllers: [ExerciseController],
	providers: [
		QuizExerciseService,
		MultipleChoiceExerciseService,
		CodingExerciseService,
	],
	exports: [
		QuizExerciseService,
		MultipleChoiceExerciseService,
		CodingExerciseService,
	],
})
export class ExerciseModule {}
