import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateSpellBookDto {
	@IsOptional()
	@ApiProperty({ example: "add list in js" })
	name?: string;

	@IsOptional()
	@ApiProperty({
		example: "*** add list in js **\n\n```js\nconst list = [];\n```\n\n",
	})
	content?: string;
}
