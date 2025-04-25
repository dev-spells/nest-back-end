import { ApiProperty } from "@nestjs/swagger";

export class UseXPPotionResponseDto {
	@ApiProperty({ example: "XP Potion" })
	item: string;

	@ApiProperty({
		example: 1744602894667,
		description: "Timestamp when the XP boost started (in milliseconds)",
	})
	startedAt: number;

	@ApiProperty({
		example: 40,
		description: "Bonus XP percentage or amount provided by the item",
	})
	bonus: number;

	@ApiProperty({
		example: 60,
		description: "Duration of the XP boost in minutes",
	})
	duration: number;

	@ApiProperty({ description: "Quantity of the item remaining" })
	quantity: number;
}

class StatsDto {
	@ApiProperty({ example: 40, description: "Bonus XP gained" })
	bonus: number;

	@ApiProperty({ example: 60, description: "Duration in minutes" })
	duration: number;
}

export class XpPotionResponseDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "XP Potion" })
	name: string;

	@ApiProperty({ example: "Gain bonus XP when complete lesson" })
	description: string;

	@ApiProperty({ type: StatsDto })
	stats: StatsDto;

	@ApiProperty({ example: "https://example.com/images/xp-potion.png" })
	imageUrl: string;
}
