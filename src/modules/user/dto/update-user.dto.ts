import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
	@ApiProperty()
	@IsOptional()
	username?: string;

	@ApiProperty()
	@IsOptional()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: "Password must contain at least one special character",
	})
	password?: string;

	@IsOptional()
	@ApiProperty({ nullable: true })
	avatarUrl?: string;

	@IsOptional()
	@ApiProperty({ nullable: true })
	level?: number;

	@IsOptional()
	@ApiProperty({ nullable: true })
	currentExp?: number;

	@IsOptional()
	@ApiProperty({ nullable: true })
	rankTitle?: string;

	@IsOptional()
	@ApiProperty({ nullable: true })
	gems?: number;

	@IsOptional()
	@ApiProperty({ nullable: true })
	timezone?: string;

	@IsOptional()
	@ApiProperty({ nullable: true })
	isActived?: boolean;

	@IsOptional()
	@ApiProperty({ nullable: true })
	githubAccessToken?: string;
}
