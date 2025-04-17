import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class AddItemInShopDto {
	@IsNotEmpty()
	@Min(1)
	@IsInt()
	@ApiProperty({ minimum: 1 })
	buyPrices: number;

	@IsNotEmpty()
	@Min(1)
	@IsInt()
	@ApiProperty({ minimum: 1 })
	sellPrices: number;
}
