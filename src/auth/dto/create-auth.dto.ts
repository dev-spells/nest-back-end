import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from "class-validator";

import { PASSWORD_ERRORS } from "src/constants/errors";

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
	@MinLength(8, { message: PASSWORD_ERRORS.MIN_LENGTH })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: PASSWORD_ERRORS.SPECIAL_CHAR,
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
	@MinLength(8, { message: PASSWORD_ERRORS.MIN_LENGTH })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: PASSWORD_ERRORS.SPECIAL_CHAR,
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
	@MinLength(8, { message: PASSWORD_ERRORS.MIN_LENGTH })
	@Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
		message: PASSWORD_ERRORS.SPECIAL_CHAR,
	})
	@IsNotEmpty()
	@ApiProperty()
	newPassword: string;
}
