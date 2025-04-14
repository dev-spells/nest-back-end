import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StatsDto {
	@ApiProperty({ example: 40, description: "XP bonus percentage or value" })
	bonus: number;

	@ApiProperty({ example: 60, description: "Duration in minutes" })
	duration: number;
}

export class ItemResponse {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "XP Potion" })
	name: string;

	@ApiProperty({ example: "gain bonus XP when complete lesson" })
	description: string;

	@ApiPropertyOptional({ type: StatsDto, nullable: true })
	stats?: StatsDto | null;

	@ApiProperty({ example: "https://example.com/image.png" })
	imageUrl: string;
}
