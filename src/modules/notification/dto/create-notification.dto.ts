import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
	@ApiProperty()
	type: string;

	@ApiProperty()
	message: any;

	@ApiProperty()
	courseId?: number | null;
}
