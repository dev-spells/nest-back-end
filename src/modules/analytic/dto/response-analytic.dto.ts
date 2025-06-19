import { ApiProperty } from "@nestjs/swagger";

export class NamedValueDto {
	@ApiProperty({ example: "2025-05-09" })
	name: string;

	@ApiProperty({ example: 1 })
	value: number;
}

export class CourseJoinDto {
	@ApiProperty({ example: "Learn to Code in Python" })
	name: string;

	@ApiProperty({ example: 3 })
	value: number;
}

export class AnalyticsResponseDto {
	@ApiProperty({ example: 8 })
	totalMember: number;

	@ApiProperty({ example: 10 })
	totalCourse: number;

	@ApiProperty({ example: 10 })
	totalItem: number;

	@ApiProperty({ example: 10 })
	totalItemInShop: number;

	@ApiProperty({ example: 10 })
	totalOpenUserFeedback: number;

	// @ApiProperty({ type: [NamedValueDto] })
	// lessonComplete: NamedValueDto[];

	@ApiProperty({ type: [NamedValueDto] })
	userJoin: NamedValueDto[];

	@ApiProperty({ type: [CourseJoinDto] })
	courseJoin: CourseJoinDto[];
}
