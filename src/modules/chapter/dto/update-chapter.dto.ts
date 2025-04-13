import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateChapterDto {
	@ApiProperty({
		example: "Introduction",
	})
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@ApiProperty({ required: false })
	id: number;

	@IsNotEmpty()
	@ApiProperty({ required: true })
	pos: number;
}
