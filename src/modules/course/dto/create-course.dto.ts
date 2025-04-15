import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateCourseDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: "Title must not contain special characters",
	})
	title: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@Matches(/^[a-zA-Z0-9\s]+$/, {
		message: "Description must not contain special characters",
	})
	description: string;

	@ApiProperty({ nullable: true })
	iconUrl: string;

	@ApiProperty()
	@IsNotEmpty()
	isPublic: boolean;
}
