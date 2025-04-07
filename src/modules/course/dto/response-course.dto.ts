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
	created_at: Date;

	@ApiProperty({ example: new Date() })
	@Expose()
	updated_at: Date;

	@ApiProperty({ example: "Course Description" })
	@Expose()
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	@Expose()
	icon_url: string;

	@ApiProperty({ example: true })
	@Expose()
	is_public: boolean;

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
	created_at: Date;

	@ApiProperty({ example: new Date() })
	@Expose()
	updated_at: Date;

	@ApiProperty({ example: "Course Description" })
	@Expose()
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	@Expose()
	icon_url: string;

	@ApiProperty({ example: true })
	@Expose()
	is_public: boolean;

	@ApiProperty({
		type: [ChapterInfo],
		example: [{ id: 1, name: "1. Test chapter" }],
	})
	@Expose()
	@Type(() => ChapterInfo)
	chaptersList: ChapterInfo[];
}
