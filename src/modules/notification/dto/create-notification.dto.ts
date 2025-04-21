import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
	@ApiProperty()
	type: string;

	@ApiProperty()
	data: any;
}
