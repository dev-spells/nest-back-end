import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
	@ApiProperty({ example: "user123" })
	userId: string;

	@ApiProperty({ example: "john_doe" })
	username: string;

	@ApiProperty({ example: "john@example.com" })
	email: string;

	@ApiProperty({ example: "https://example.com/avatar.jpg" })
	avatarUrl: string;
}

export class CourseDto {
	@ApiProperty({ example: "course123" })
	courseId: string;

	@ApiProperty({ example: "Introduction to Programming" })
	courseName: string;
}

export class ChapterDto {
	@ApiProperty({ example: "chapter123" })
	chapterId: string;

	@ApiProperty({ example: "Chapter 1: Basics" })
	chapterName: string;

	@ApiProperty({ type: CourseDto })
	course: CourseDto;
}

export class LessonDto {
	@ApiProperty({ example: "lesson123" })
	lessonId: string;

	@ApiProperty({ example: "Lesson 1: Getting Started" })
	lessonName: string;

	@ApiProperty({ type: ChapterDto })
	chapter: ChapterDto;
}

export class FeedbackResultDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ type: UserDto })
	user: UserDto;

	@ApiProperty({ type: LessonDto })
	lesson: LessonDto;

	@ApiProperty({ example: "2024-03-20T10:00:00Z" })
	createdAt: Date;

	@ApiProperty({
		example: "PENDING",
		enum: ["PENDING", "RESOLVED", "REJECTED"],
	})
	status: string;

	@ApiProperty({ example: "This lesson was very helpful!" })
	feedback: string;

	@ApiProperty({
		example: "BUG",
		enum: ["BUG", "FEATURE", "IMPROVEMENT", "OTHER"],
	})
	feedbackType: string;
}

export class MetaDto {
	@ApiProperty({ example: 1 })
	current: number;

	@ApiProperty({ example: 10 })
	pageSize: number;

	@ApiProperty({ example: 5 })
	pages: number;

	@ApiProperty({ example: 50 })
	total: number;
}

export class GetFeedbackResponse {
	@ApiProperty({ type: [FeedbackResultDto] })
	feedbacks: FeedbackResultDto[];

	@ApiProperty({ type: MetaDto })
	meta: MetaDto;
}
