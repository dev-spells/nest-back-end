import { ApiProperty } from "@nestjs/swagger";

export class ResponseCheckItemProtectDto {
	@ApiProperty({
		description: "Quantity of item",
		example: 20,
	})
	quantity: number;
}
