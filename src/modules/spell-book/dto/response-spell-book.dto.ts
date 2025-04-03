import { ApiProperty } from "@nestjs/swagger";

export class ResponseSpellBook {
	@ApiProperty({
		example: 1,
	})
	id: number;

	@ApiProperty({
		example: "list in js",
		description: "The name of the spell book",
	})
	name: string;
}

export class ResponseDetailSpellBook {
	@ApiProperty({
		example: 1,
	})
	id: number;

	@ApiProperty({
		example: "list in js",
		description: "The name of the spell book",
	})
	name: string;

	@ApiProperty({
		example: "*** add list in js **\n\n```js\nconst list = [];\n```\n\n",
		description: "The content of the spell book",
	})
	content: string;
}
