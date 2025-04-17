import { ApiProperty } from "@nestjs/swagger";

export class ItemDetailDto {
	@ApiProperty({ example: "Unlock Gem", description: "Name of the item" })
	name: string;

	@ApiProperty({
		example: "unlock the solution",
		description: "Description of the item",
	})
	description: string;

	@ApiProperty({
		example: "https://example.com/image.png",
		description: "URL of the item image",
	})
	imageUrl: string;
}

export class GetShopResponseDto {
	@ApiProperty({ example: 2, description: "Unique identifier for the item" })
	itemId: number;

	@ApiProperty({
		description: "Item details",
		type: () => ItemDetailDto,
	})
	item: ItemDetailDto;

	@ApiProperty({ example: 20, description: "Sell price of the item" })
	sellPrices: number;

	@ApiProperty({ example: 10, description: "Buy price of the item" })
	buyPrices: number;

	@ApiProperty({ example: 91, description: "Available quantity of the item" })
	quantity: number;
}

export class ShopItemDto {
	@ApiProperty({ example: 1 })
	itemId: number;

	@ApiProperty({ example: 20, description: "Sell price of the item" })
	sellPrices: number;

	@ApiProperty({ example: 10, description: "Buy price of the item" })
	buyPrices: number;
}

export class BuySellItemDto {
	@ApiProperty({ example: 1, description: "Unique identifier for the item" })
	itemId: number;

	@ApiProperty({ example: 10, description: "Remain gems" })
	gems: number;

	@ApiProperty({ example: 10, description: "Quantity of the item" })
	quantity: number;
}
