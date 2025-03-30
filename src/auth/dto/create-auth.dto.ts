import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from "class-validator";

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: "Password must contain at least one special character",
	})
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}

export class SendOtp {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;
}

export class VerifyOtpDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	otp: string;
}

export class ForgotPasswordDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;
}

export class ResetPasswordDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	resetToken: string;

	@IsString()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: "Password must contain at least one special character",
	})
	@IsNotEmpty()
	@ApiProperty()
	newPassword: string;
}

export class UpdatePasswordDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	oldPassword: string;

	@IsString()
	@MinLength(8, { message: "Password must be at least 8 characters long" })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: "Password must contain at least one special character",
	})
	@IsNotEmpty()
	@ApiProperty()
	newPassword: string;
}
