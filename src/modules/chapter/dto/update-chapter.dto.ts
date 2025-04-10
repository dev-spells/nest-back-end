import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UpdateChapterDto {
	@ApiProperty({
		description:
			'Chapter name must be in format "Cnumber: chaptername" (e.g. "C1: Introduction")',
		example: "C1: Introduction",
	})
	@IsNotEmpty()
	@Matches(/^C[0-9]+:\s[a-zA-Z0-9\s]+$/, {
		message:
			'Name must be in format "Cnumber: chaptername" (e.g. "C1: Introduction")',
	})
	name: string;

	@IsOptional()
	@ApiProperty({ required: false })
	id: number;
}
