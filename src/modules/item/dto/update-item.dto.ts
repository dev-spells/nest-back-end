import { ApiProperty } from "@nestjs/swagger";

export class updateItemDto {
	@ApiProperty({ example: "item name", required: false })
	name?: string;

	@ApiProperty({ example: "item description", required: false })
	description?: string;

	@ApiProperty({ example: "item image url", required: false })
	imageUrl?: string;
}
