import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { LessonDifficulty } from "src/entities/lesson.entity";

export class UpdateLessonDto {
	@IsOptional()
	@ApiProperty()
	name?: string;

	@IsOptional()
	@ApiProperty()
	content?: string;

	@IsOptional()
	@IsEnum(LessonDifficulty, {
		message: "Difficulty must be one of: EASY, MEDIUM, HARD",
	})
	@ApiProperty({ required: false, enum: LessonDifficulty })
	difficulty?: LessonDifficulty;
}
