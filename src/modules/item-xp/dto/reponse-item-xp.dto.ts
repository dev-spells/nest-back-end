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
}
