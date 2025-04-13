import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	ValidateNested,
} from "class-validator";

export class CreateChapterDto {
	@ApiProperty({
		description: "ID of the course to which the chapter belongs",
		example: 1,
	})
	@IsNotEmpty()
	courseId: number;

	@ApiProperty({
		example: "Introduction",
	})
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@ApiProperty({
		description: "order of the chapter in the course",
		example: 1,
	})
	pos: number;
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
			{ name: "Introduction" },
			{ name: "Fundamentals" },
			{ name: "Advanced" },
		],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateChapterDto)
	chapters: CreateChapterDto[];
}
