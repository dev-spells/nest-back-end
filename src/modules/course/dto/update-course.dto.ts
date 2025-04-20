import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateCourseDto {
	@IsOptional()
	@ApiProperty({ required: false })
	title?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	description?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	iconUrl?: string;

	@IsOptional()
	@ApiProperty({ required: false })
	isPublic?: boolean;
}
