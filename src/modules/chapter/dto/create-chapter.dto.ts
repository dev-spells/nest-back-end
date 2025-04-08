import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	Matches,
	ValidateNested,
} from "class-validator";

export class CreateChapterDto {
	@ApiProperty({
		description:
			'Chapter name must be in format "Cnumber: chaptername" (e.g. "C1: Introduction")',
		example: "C1: Introduction",
	})
	@IsNotEmpty()
	@Matches(/^C[0-9]+:\s[a-zA-Z0-9\s]+$/, {
		message:
			'Name must be in format "Cnumber: chaptername" (e.g. "C1: Introduction")',
	})
	name: string;
}

export class CreateBatchChaptersDto {
	@ApiProperty({
		description: "ID of the course to which the chapters belong",
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	courseId: number;

	@ApiProperty({
		description: "List of chapters to be created",
		example: [
			{ name: "C1: Introduction" },
			{ name: "C2: Fundamentals" },
			{ name: "C3: Advanced" },
		],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateChapterDto)
	chapters: CreateChapterDto[];
}
