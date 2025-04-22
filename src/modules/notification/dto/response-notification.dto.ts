import { ApiProperty } from "@nestjs/swagger";

export class CourseInfo {
	@ApiProperty()
	id: number;

	@ApiProperty()
	title: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	iconUrl: string;

	@ApiProperty()
	isPublic: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

export class NotificationResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	type: string;

	@ApiProperty()
	message: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	isRead: boolean;

	@ApiProperty({ type: () => CourseInfo, nullable: true })
	course: CourseInfo | null;
}
