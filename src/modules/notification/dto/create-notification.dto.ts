import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
	@ApiProperty()
	type: string;

	@ApiProperty()
	message: any;

	@ApiProperty()
	courseId?: number | null;

	@ApiProperty()
	itemId?: number | null;
}

export class CreateServerNotificationDto {
	@ApiProperty()
	message: string;
}
