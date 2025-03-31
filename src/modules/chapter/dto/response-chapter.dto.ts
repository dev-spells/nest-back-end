import { ApiProperty } from "@nestjs/swagger";

export class ResponseChapter {
	@ApiProperty()
	id: number;
	@ApiProperty()
	name: string;
	@ApiProperty()
	created_at: Date;
	@ApiProperty()
	updated_at: Date;
	@ApiProperty()
	courseId: number;
}
