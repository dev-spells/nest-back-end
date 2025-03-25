import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: "Password must contain at least one special character",
	})
	password: string;

	@ApiProperty({ nullable: true })
	avatarUrl?: string;
}
