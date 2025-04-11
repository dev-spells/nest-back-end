import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

export class LessonInfo {
	@ApiProperty()
	id: number;
	@ApiProperty()
	name: string;
	@ApiProperty({ example: "EASY" })
	difficulty: string;
}

class ChapterInfo {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "1. Test chapter" })
	name: string;

	@ApiProperty({ example: 1 })
	pos: number;

	@ApiProperty({
		type: [LessonInfo],
		example: [{ id: 1, name: "Test lesson", difficulty: "EASY" }],
	})
	@Type(() => LessonInfo)
	lessons: LessonInfo[];
}

export class ResponseCourseDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "Course Title" })
	title: string;

	@ApiProperty({ example: new Date() })
	createdAt: Date;

	@ApiProperty({ example: new Date() })
	updatedAt: Date;

	@ApiProperty({ example: "Course Description" })
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	iconUrl: string;

	@ApiProperty({ example: true })
	isPublic: boolean;

	@ApiProperty({ example: 1 })
	chaptersCount: number;

	@ApiProperty({ example: 2 })
	lessonsCount: number;

	@ApiProperty({
		type: [ChapterInfo],
		example: [
			{
				id: 1,
				name: "1. Test chapter",
				pos: 1,
				lessons: [{ id: 1, name: "Test lesson", difficulty: "EASY" }],
			},
		],
	})
	@Type(() => ChapterInfo)
	chapters: ChapterInfo[];
}

export class ResponseCourseDetailDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "Course Title" })
	title: string;

	@ApiProperty({ example: new Date() })
	createdAt: Date;

	@ApiProperty({ example: new Date() })
	updatedAt: Date;

	@ApiProperty({ example: "Course Description" })
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	iconUrl: string;

	@ApiProperty({ example: true })
	isPublic: boolean;

	@ApiProperty({
		type: [ChapterInfo],
		example: [
			{
				id: 1,
				name: "1. Test chapter",
				pos: 1,
				lessons: [{ id: 1, name: "Test lesson", difficulty: "EASY" }],
			},
		],
	})
	@Type(() => ChapterInfo)
	chapters: ChapterInfo[];
}
