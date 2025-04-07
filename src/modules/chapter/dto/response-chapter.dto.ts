import { ApiProperty } from "@nestjs/swagger";

class Lesson {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}

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
	@ApiProperty({ type: [Lesson] })
	lessons: Lesson[];
}
