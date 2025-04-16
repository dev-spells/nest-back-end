import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class ItemProtectStreakStats {
	@ApiProperty()
	@IsNotEmpty()
	duration: number;
}

export class UpdateItemProtectStreakDto {
	@IsOptional()
	@ApiProperty({ required: false })
	imageUrl: string;

	@IsOptional()
	@ApiProperty({ required: false })
	name: string;

	@IsOptional()
	@ApiProperty({ required: false })
	description: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => ItemProtectStreakStats)
	@ApiProperty({ required: false, type: ItemProtectStreakStats })
	stats: ItemProtectStreakStats;
}
