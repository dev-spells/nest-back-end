import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class CreateMultipleChoiceExerciseDto {
	@IsNotEmpty()
	@ApiProperty()
	question: string;

	@IsNotEmpty()
	@ApiProperty()
	options: string[];

	@IsNotEmpty()
	@ApiProperty()
	answer: string;
}

export class CreateQuizExerciseDto {
	@IsOptional()
	@ApiProperty({ required: false })
	question?: string;

	@IsOptional()
	@ApiProperty()
	answer: string;
}

export class CodeSnippet {
	@IsString()
	@ApiProperty()
	snippet: string;

	@IsString()
	@ApiProperty()
	solutionSnippet: string;

	@IsString()
	@ApiProperty()
	fileName: string;
}

export class CreateCodingExerciseDto {
	@IsNotEmpty()
	@ApiProperty()
	answer: string;

	@IsNotEmpty()
	@ApiProperty()
	language: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CodeSnippet)
	@ApiProperty({ type: [CodeSnippet] })
	codingSnippets: CodeSnippet[];
}
