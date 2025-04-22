import { ApiProperty } from "@nestjs/swagger";

export class CourseInfo {
	@ApiProperty()
	id: number;

	@ApiProperty()
	title: string;

	@ApiProperty()
	iconUrl: string;
}

export class ItemInfo {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	imageUrl: string;
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

	@ApiProperty({ type: () => ItemInfo, nullable: true })
	item: ItemInfo | null;
}
