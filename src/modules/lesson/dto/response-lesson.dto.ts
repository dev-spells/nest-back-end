import { ApiProperty } from "@nestjs/swagger";

import { LessonDifficulty } from "src/entities/lesson.entity";

export class LessonDto {
	@ApiProperty({ example: 13 })
	id: number;

	@ApiProperty({ example: "Introduction to TypeScript" })
	name: string;

	@ApiProperty({ example: "This lesson covers the basics of TypeScript..." })
	content: string;

	@ApiProperty({ enum: LessonDifficulty, example: LessonDifficulty.MEDIUM })
	difficulty: LessonDifficulty;
}

export class CodingExerciseSnippetDto {
	@ApiProperty({ example: 30 })
	id: number;

	@ApiProperty({ example: "main.ts" })
	fileName: string;

	@ApiProperty({
		example: "function add(a: number, b: number) {\n  // Your code here\n}",
	})
	snippet: string;

	@ApiProperty({
		example: "function add(a: number, b: number) {\n  return a + b;\n}",
	})
	solutionSnippet: string;
}

export class CodingExerciseDto {
	@ApiProperty({ example: 26 })
	id: number;

	@ApiProperty({ example: "return a + b;" })
	correctAnswer: string;

	@ApiProperty({ example: "typescript" })
	language: string;

	@ApiProperty({ type: [CodingExerciseSnippetDto] })
	codingSnippets: CodingExerciseSnippetDto[];
}

export class QuizExerciseDto {
	@ApiProperty({ example: 15 })
	id: number;

	@ApiProperty({ example: "What is TypeScript?" })
	question: string;

	@ApiProperty({
		example: "A strongly typed programming language that builds on JavaScript",
	})
	answer: string;
}

export class MultipleChoiceExerciseDto {
	@ApiProperty({ example: 20 })
	id: number;

	@ApiProperty({
		example: "Which of the following is not a TypeScript primitive type?",
	})
	question: string;

	@ApiProperty({ example: ["string", "number", "object", "boolean"] })
	options: string[];

	@ApiProperty({ example: "object" })
	answer: string;
}

export class LessonResponseDto {
	@ApiProperty({ type: LessonDto })
	lesson: LessonDto;

	@ApiProperty({ type: CodingExerciseDto, nullable: true })
	codingExercise: CodingExerciseDto | null;

	@ApiProperty({ type: QuizExerciseDto, nullable: true })
	quizExercise: QuizExerciseDto | null;

	@ApiProperty({ type: MultipleChoiceExerciseDto, nullable: true })
	multipleChoiceExercise: MultipleChoiceExerciseDto | null;
}
