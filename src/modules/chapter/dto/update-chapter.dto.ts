import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateChapterDto } from "./create-chapter.dto";
import { IsNotEmpty, Matches } from "class-validator";

export class UpdateChapterDto {
	@ApiProperty({
		description:
			'Chapter name must start with a number followed by text (e.g. "1.Introduction")',
		example: "1.Introduction",
	})
	@IsNotEmpty()
	@Matches(/^[0-9]+\.[a-zA-Z0-9]+$/, {
		message:
			'Name must start with a number followed by a dot and text (e.g. "1.Introduction")',
	})
	name: string;
}
