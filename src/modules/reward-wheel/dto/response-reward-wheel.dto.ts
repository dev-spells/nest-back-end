import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

export enum RewardType {
	GEMS = "GEMS",
	XP = "XP",
	ITEM = "ITEM",
}

export class RewardItemStatsDto {
	@ApiProperty({ example: 50 })
	bonus: number;

	@ApiProperty({ example: 120 })
	duration: number;
}

export class RewardItemDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "XP Potion" })
	name: string;

	@ApiProperty({
		example:
			"Earn bonus XP from lessons to level up faster and unlock achievements.",
	})
	description: string;

	@ApiProperty({ type: RewardItemStatsDto })
	stats: RewardItemStatsDto;

	@ApiProperty({
		example:
			"https://dev-spells.s3.amazonaws.com/items/b07bf08f-fe52-47a4-95b0-dcb628e6c96c.png",
	})
	imageUrl: string;
}

export class RewardUserDto {
	@ApiProperty({ example: false })
	levelUp: boolean;

	@ApiProperty({ example: 433 })
	gems: number;

	@ApiProperty({ example: 130 })
	currentExp: number;

	@ApiProperty({ example: 20 })
	level: number;

	@ApiProperty({ example: 20 })
	expToLevelUp: number;

	@ApiProperty({ example: "silver-border" })
	borderUrl: string;

	@ApiProperty({ example: "Silver" })
	rankTitle: string;
}

export class HandleRewardResponseDto {
	@ApiProperty({ enum: RewardType, example: RewardType.ITEM })
	rewardType: RewardType;

	@ApiPropertyOptional({ example: 50 })
	gems?: number;

	@ApiPropertyOptional({ example: 100 })
	xp?: number;

	@ApiPropertyOptional({ type: RewardItemDto })
	item?: RewardItemDto;

	@ApiPropertyOptional({ type: RewardUserDto })
	user?: RewardUserDto;

	@ApiProperty({ example: false })
	canSpin: boolean;
}

export class WheelRewardDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ enum: RewardType, example: RewardType.GEMS })
	rewardType: RewardType;

	@ApiPropertyOptional({ type: RewardItemDto, nullable: true })
	item?: RewardItemDto | null;

	@ApiPropertyOptional({ example: 100, nullable: true })
	gems?: number | null;

	@ApiPropertyOptional({ example: 50, nullable: true })
	xp?: number | null;

	@ApiProperty({ example: 25 })
	probability: number;
}

export class CheckUserWheelResponseDto {
	@ApiProperty({ example: false })
	canSpin: boolean;

	@ApiProperty({ example: 1100 })
	totalExpGainedToday: number;

	@ApiProperty({ example: 3000 })
	wheelThreshold: number;
}
