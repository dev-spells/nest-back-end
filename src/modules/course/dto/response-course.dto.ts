import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class ResponseCourseDto {
	@ApiProperty({ example: 1 })
	@Expose()
	id: number;

	@ApiProperty({ example: "Course Title" })
	@Expose()
	title: string;

	@ApiProperty({ example: new Date() })
	@Expose()
	created_at: Date;

	@ApiProperty({ example: new Date() })
	@Expose()
	updated_at: Date;

	@ApiProperty({ example: "Course Description" })
	@Expose()
	description: string;

	@ApiProperty({ example: "https://www.example.com" })
	@Expose()
	icon_url: string;

	@ApiProperty({ example: true })
	@Expose()
	is_public: boolean;
}
