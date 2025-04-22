import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserSubmissionDto {
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	lessonId: number;

	@IsNotEmpty()
	@ApiProperty({ example: "true" })
	userAnswer: string;

	@IsNotEmpty()
	@ApiProperty({ example: "false" })
	freeSolution: boolean;
}
