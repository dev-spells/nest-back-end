import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class ItemXPStats {
	@ApiProperty()
	@IsNotEmpty()
	duration: number;

	@ApiProperty()
	@IsNotEmpty()
	bonus: number;
}

export class UpdateItemXPDto {
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
	@Type(() => ItemXPStats)
	@ApiProperty({ required: false, type: ItemXPStats })
	stats: ItemXPStats;
}
