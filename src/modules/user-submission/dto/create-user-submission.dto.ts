import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserSubmissionDto {
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	lessonId: number;

	@IsNotEmpty()
	@ApiProperty({ example: "true" })
	userAnswer: string;
}
