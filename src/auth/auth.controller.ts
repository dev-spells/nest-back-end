import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiNotFoundResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { Public } from "src/decorators/public-route";
import { Roles } from "src/decorators/role-route";

import {
	ForgotPasswordDto,
	LoginDto,
	RegisterDto,
	ResetPasswordDto,
	SendOtp,
	UpdatePasswordDto,
	VerifyOtpDto,
} from "./dto/create-auth.dto";
import { LocalAuthGuard } from "./passport/local-auth.guard";
import { RefreshAuthGuard } from "./passport/refresh-auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: "Register a new user" })
	@ApiResponse({ status: 201, description: "User registered successfully" })
	@ApiBadRequestResponse({ description: "Username or email already exists" })
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@Public()
	@Post("register")
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post("login")
	@ApiBody({ type: LoginDto })
	@Public()
	@UseGuards(LocalAuthGuard)
	handleLogin(@Request() req) {
		return req.user;
	}

	@ApiOperation({ summary: "Refresh access token" })
	@ApiResponse({ status: 200, description: "Token refreshed successfully" })
	@ApiUnauthorizedResponse({
		description: "Invalid refresh token",
	})
	@ApiBearerAuth()
	@Public()
	@UseGuards(RefreshAuthGuard)
	@Post("refresh-token")
	async refreshToken(@Request() req) {
		return this.authService.refreshAccessToken(req.user);
	}

	@Public()
	@ApiOperation({ summary: "Verify account with OTP" })
	@ApiResponse({ status: 200, description: "Account verified successfully" })
	@ApiBadRequestResponse({
		description: "Invalid OTP or account already verified",
	})
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@Post("verify-account")
	async verifyAccount(@Body() verifyOtpDto: VerifyOtpDto) {
		return this.authService.verifyAccount(verifyOtpDto);
	}

	@Public()
	@ApiOperation({ summary: "Resend verification OTP" })
	@ApiResponse({ status: 200, description: "OTP resent successfully" })
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid email or wait before get the next one",
	})
	@Post("resend-verification-otp")
	async resendVerificationOtp(@Body() sendOtp: SendOtp) {
		return this.authService.resendVerificationOtp(sendOtp);
	}

	@Public()
	@ApiOperation({ summary: "Send forgot password OTP" })
	@ApiResponse({ status: 200, description: "OTP sent successfully" })
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@Post("forgot-password")
	async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.sendForgotPasswordOtp(forgotPasswordDto);
	}

	@Public()
	@ApiOperation({ summary: "Resend forgot password OTP" })
	@ApiResponse({ status: 200, description: "OTP resent successfully" })
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid email or wait before get the next one",
	})
	@Post("resend-forgot-password-otp")
	async resendForgotPasswordOtp(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.resendForgotPasswordOtp(forgotPasswordDto);
	}

	@Public()
	@ApiOperation({ summary: "Verify forgot password OTP" })
	@ApiResponse({ status: 200, description: "OTP verified successfully" })
	@ApiBadRequestResponse({
		description: "Invalid OTP or OTP expired",
	})
	@Post("verify-forgot-password")
	async verifyForgotPasswordOtp(@Body() verifyOtpDto: VerifyOtpDto) {
		return this.authService.verifyForgotPasswordOtp(verifyOtpDto);
	}

	@Public()
	@ApiOperation({ summary: "Reset password with token" })
	@ApiResponse({ status: 200, description: "Password reset successfully" })
	@ApiBadRequestResponse({
		description: "Invalid token or password reset failed",
	})
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@Post("reset-password")
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(
			resetPasswordDto.email,
			resetPasswordDto.resetToken,
			resetPasswordDto.newPassword,
		);
	}

	@ApiOperation({ summary: "Update password" })
	@ApiResponse({ status: 200, description: "Password updated successfully" })
	@ApiNotFoundResponse({
		description: "User not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid password",
	})
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Post("update-password")
	async updatePassword(
		@Request() req,
		@Body() updatePasswordDto: UpdatePasswordDto,
	) {
		return this.authService.updatePassword(req.user.id, updatePasswordDto);
	}
}
