// src/decorators/validate-exercise.ts
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { LESSON_ERRORS } from "src/constants/errors";
import { CreateLessonDto } from "src/modules/lesson/dto/create-lesson.dto";

@Injectable()
export class OnlyOneExercisePipe implements PipeTransform {
	transform(value: CreateLessonDto) {
		const exerciseFields = [
			"codingExercise",
			"multipleChoiceExercise",
			"quizExercise",
		];

		const providedExercises = exerciseFields.filter(
			field => value[field] !== undefined && value[field] !== null,
		);

		if (providedExercises.length !== 1) {
			throw new BadRequestException(LESSON_ERRORS.MORE_THAN_ONE_EXERCISE);
		}

		return value;
	}
}
