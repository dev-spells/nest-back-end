import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateMultipleChoiceExerciseDto {
	@IsOptional()
	@ApiProperty({ required: false })
	question?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	options?: string[];

	@IsOptional()
	@ApiProperty({ required: false })
	answer?: string;
}

export class UpdateQuizExerciseDto {
	@IsOptional()
	@ApiProperty({ required: false })
	question?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	answer?: string;
}

export class UpdateCodingExerciseDto {
	@IsOptional()
	@ApiProperty({ required: false })
	answer?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	language?: string;
}

export class UpdateCodingSnippetDto {
	@IsOptional()
	@ApiProperty({ required: false })
	id: number;

	@IsOptional()
	@IsString()
	@ApiProperty({ required: false })
	snippet?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ required: false })
	solutionSnippet?: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ required: false })
	fileName?: string;
}
