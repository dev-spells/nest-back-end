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
	createdAt: Date;
	@ApiProperty()
	updatedAt: Date;
	@ApiProperty()
	courseId: number;
	@ApiProperty()
	pos: number;
	@ApiProperty({ type: [Lesson] })
	lessons: Lesson[];
}
