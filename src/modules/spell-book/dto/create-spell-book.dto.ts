import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSpellBookDto {
	@IsNotEmpty()
	@ApiProperty({ example: "add list in js" })
	name: string;

	@IsNotEmpty()
	@ApiProperty({
		example: "*** add list in js **\n\n```js\nconst list = [];\n```\n\n",
	})
	content: string;
}
