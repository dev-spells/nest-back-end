import { ApiProperty } from "@nestjs/swagger";

export class ResponseLogin {
	@ApiProperty()
	accessToken: string;
	@ApiProperty()
	refreshToken: string;
}

export class ResponseVerifyForgotPassword {
	@ApiProperty()
	resetToken: string;
}
