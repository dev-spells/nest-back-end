import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateCourseDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: "Title must not contain special characters",
	})
	title: string;

	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: "Description must not contain special characters",
	})
	description: string;

	@ApiProperty({ nullable: true })
	icon_url: string;

	@ApiProperty()
	@IsNotEmpty()
	is_public: boolean;
}
