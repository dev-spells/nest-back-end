import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { LessonDifficulty } from "src/entities/lesson.entity";
import {
	CreateCodingExerciseDto,
	CreateMultipleChoiceExerciseDto,
	CreateQuizExerciseDto,
} from "src/modules/exercise/dto/create-exercise.dto";
import { CreateSpellBookDto } from "src/modules/spell-book/dto/create-spell-book.dto";

export class CreateLessonDto {
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsNotEmpty()
	@ApiProperty()
	content: string;

	@IsOptional()
	@IsEnum(LessonDifficulty, {
		message: "Difficulty must be one of: EASY, MEDIUM, HARD",
	})
	@ApiProperty({ required: false, enum: LessonDifficulty })
	difficulty?: LessonDifficulty;

	@IsNotEmpty()
	@ApiProperty()
	chapterId: number;

	@ValidateNested()
	@Type(() => CreateCodingExerciseDto)
	@ApiProperty({ required: false, type: CreateCodingExerciseDto })
	codingExercise?: CreateCodingExerciseDto;

	@ValidateNested()
	@Type(() => CreateMultipleChoiceExerciseDto)
	@ApiProperty({ required: false, type: CreateMultipleChoiceExerciseDto })
	multipleChoiceExercise?: CreateMultipleChoiceExerciseDto;

	@ValidateNested()
	@Type(() => CreateQuizExerciseDto)
	@ApiProperty({ required: false, type: CreateQuizExerciseDto })
	quizExercise?: CreateQuizExerciseDto;

	@IsOptional()
	@ApiProperty({ required: false })
	spellBook?: CreateSpellBookDto;
}
