import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { WheelRewardType } from "src/entities/wheel-item.entity";

export class CreateRewardWheelDto {
	@ApiProperty({
		description: "The type of reward",
		enum: WheelRewardType,
		example: WheelRewardType.GEMS,
	})
	@IsEnum(WheelRewardType)
	@IsNotEmpty()
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
		example: 25,
	})
	@IsNumber()
	@IsNotEmpty()
	probability?: number;
}

export class HandleRewardDto {
	@ApiProperty({
		description: "The ID of the wheel item to handle",
	})
	@IsNumber()
	@IsNotEmpty()
	wheelItemId: number;
}
