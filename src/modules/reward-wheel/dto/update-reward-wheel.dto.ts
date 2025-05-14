import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { WheelRewardType } from "src/entities/wheel-item.entity";

export class UpdateRewardWheelDto {
	@ApiProperty({
		description: "The unique identifier of the wheel item to update",
		example: 1,
	})
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@ApiProperty({
		description: "The type of reward",
		enum: WheelRewardType,
		required: false,
		example: WheelRewardType.GEMS,
	})
	@IsEnum(WheelRewardType)
	@IsOptional()
	rewardType: WheelRewardType;

	@ApiProperty({
		description: "The ID of the item reward (if applicable)",
		required: false,
		example: 1,
	})
	@IsNumber()
	@IsOptional()
	itemId?: number;

	@ApiProperty({
		description: "The amount of gems to reward (if applicable)",
		required: false,
		example: 100,
	})
	@IsNumber()
	@IsOptional()
	gems?: number;

	@ApiProperty({
		description: "The amount of XP to reward (if applicable)",
		required: false,
		example: 50,
	})
	@IsNumber()
	@IsOptional()
	xp?: number;

	@ApiProperty({
		description: "The probability of winning this reward (0-100)",
		required: false,
		example: 25,
	})
	@IsNumber()
	@IsOptional()
	probability?: number;
}
