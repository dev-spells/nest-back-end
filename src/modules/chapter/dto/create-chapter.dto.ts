import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class CreateChapterDto {
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

	@ApiProperty()
	@IsNotEmpty()
	courseId: number;
}
