import { Exclude, Expose, Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

class ChapterInfo {
	@ApiProperty({ example: 1 })
	@Expose()
	id: number;

	@ApiProperty({ example: "1. Test chapter" })
	@Expose()
	name: string;
}

export class ResponseCourseDto {
	@ApiProperty({ example: 1 })
	@Expose()
	id: number;

	@ApiProperty({ example: "Course Title" })
	@Expose()
	title: string;

	@ApiProperty({ example: new Date() })
	@Expose()
	createdAt: Date;

	@ApiProperty({ example: new Date() })
	@Expose()
	updatedAt: Date;

	@ApiProperty({ example: "Course Description" })
	@Expose()
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	@Expose()
	iconUrl: string;

	@ApiProperty({ example: true })
	@Expose()
	isPublic: boolean;

	@ApiProperty({ example: 1 })
	@Expose()
	chaptersCount: number;

	@ApiProperty({ example: 2 })
	@Expose()
	lessonsCount: number;

	@ApiProperty({
		type: [ChapterInfo],
		example: [{ id: 1, name: "1. Test chapter" }],
	})
	@Expose()
	@Type(() => ChapterInfo)
	chaptersList: ChapterInfo[];
}

export class ResponseCourseDetailDto {
	@ApiProperty({ example: 1 })
	@Expose()
	id: number;

	@ApiProperty({ example: "Course Title" })
	@Expose()
	title: string;

	@ApiProperty({ example: new Date() })
	@Expose()
	createdAt: Date;

	@ApiProperty({ example: new Date() })
	@Expose()
	updatedAt: Date;

	@ApiProperty({ example: "Course Description" })
	@Expose()
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	@Expose()
	iconUrl: string;

	@ApiProperty({ example: true })
	@Expose()
	isPublic: boolean;

	@ApiProperty({
		type: [ChapterInfo],
		example: [{ id: 1, name: "1. Test chapter" }],
	})
	@Expose()
	@Type(() => ChapterInfo)
	chaptersList: ChapterInfo[];
}
