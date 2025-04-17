import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class UpdateShopDto {
	@IsInt()
	@IsOptional()
	@ApiProperty({ required: false })
	buyPrices?: number;

	@IsInt()
	@IsOptional()
	@ApiProperty({ required: false })
	sellPrices?: number;
}
