import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
	ValidateNested,
} from "class-validator";

import { UniqueFileNamesConstraint } from "src/decorators/validator-file-name";

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

	@IsNotEmpty()
	@ApiProperty()
	answer: string;
}

export class CodeSnippet {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	snippet: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	solutionSnippet: string;

	@IsNotEmpty()
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

	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CodeSnippet)
	@Validate(UniqueFileNamesConstraint)
	@ApiProperty({ type: [CodeSnippet] })
	codingSnippets: CodeSnippet[];
}
