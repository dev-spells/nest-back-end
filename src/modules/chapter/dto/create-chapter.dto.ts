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
			'Chapter name must start with a number followed by text (e.g. "1.Introduction")',
		example: "1.Introduction",
	})
	@IsNotEmpty()
	@Matches(/^[0-9]+\.[a-zA-Z0-9]+$/, {
		message:
			'Name must start with a number followed by a dot and text (e.g. "1.Introduction")',
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
			{ name: "1.Introduction" },
			{ name: "2.Fundamentals" },
			{ name: "3.Advanced" },
		],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateChapterDto)
	chapters: CreateChapterDto[];
}
