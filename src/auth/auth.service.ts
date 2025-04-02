import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { TOKEN_ERRORS, USER_ERRORS } from "src/constants/errors";
import { User } from "src/entities/user.entity";
import { UserService } from "src/modules/user/user.service";
import { hashPassword, validatePassword } from "src/utils/handle-password.util";

import { RedisService } from "./../modules/cache/cache.service";
import { MailService } from "./../modules/mail/mail.service";
import {
	ForgotPasswordDto,
	RegisterDto,
	SendOtp,
	UpdatePasswordDto,
	VerifyOtpDto,
} from "./dto/create-auth.dto";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private configService: ConfigService,
		private redisService: RedisService,
		private mailService: MailService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.userService.findByUsername(username);
		if (!user) return null;
		if (!user.isActived)
			throw new ForbiddenException(USER_ERRORS.UNVERIFIED_ACCOUNT);
		const isValidPassword = await validatePassword(pass, user.password);
		if (!isValidPassword) return null;
		return this.createToken(user);
	}

	async register(registerDTO: RegisterDto) {
		const { username, email, password } = registerDTO;

		const userByUsername = await this.userService.findByUsername(username);
		const userByEmail = await this.userService.findByEmail(email);
		if (
			(userByUsername && !userByUsername.isActived) ||
			(userByEmail && !userByEmail.isActived)
		) {
			await this.sendVerificationOtp(email);
			return {
				message:
					"Please check your email for the OTP code to verify your account",
			};
		}

		await this.userService.createUser({
			username,
			email,
			password,
		});
		await this.sendVerificationOtp(email);
		return {
			message:
				"Please check your email for the OTP code to verify your account",
		};
	}

	async refreshAccessToken(refreshTokenPayload: { id: string }) {
		const { id } = refreshTokenPayload;
		const user = await this.userService.findById(id);
		if (!user)
			throw new UnauthorizedException(TOKEN_ERRORS.INVALID_REFRESH_TOKEN);

		return this.createToken(user);
	}

	private async sendVerificationOtp(email: string) {
		const user = await this.userService.findByEmail(email);
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		if (user.isActived)
			throw new BadRequestException(USER_ERRORS.EMAIL_VERIFIED);

		if (await this.redisService.get(`verification:${email}`)) {
			return;
		}

		const otp = this.generateOtp();
		const hashedOtp = await hashPassword(otp);

		this.redisService.set(`verification:${email}`, { hashedOtp }, 60 * 5);
		this.mailService.sendUserConfirmation(user, otp);
	}

	async resendVerificationOtp(sendOtp: SendOtp) {
		const { email } = sendOtp;
		const user = await this.userService.findByEmail(email);
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		if (user.isActived)
			throw new BadRequestException(USER_ERRORS.EMAIL_VERIFIED);

		const existingOtp = await this.redisService.get(`verification:${email}`);
		if (existingOtp) throw new BadRequestException(USER_ERRORS.SPAM_OTP);

		return this.sendVerificationOtp(email);
	}

	async verifyAccount(verifyDto: VerifyOtpDto) {
		const { email, otp } = verifyDto;
		const data = await this.redisService.get<{ hashedOtp: string }>(
			`verification:${email}`,
		);

		if (!data || !(await validatePassword(otp, data.hashedOtp)))
			throw new BadRequestException(USER_ERRORS.INVALID_OTP);

		const user = await this.userService.findByEmail(email);
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		await this.userService.updateUser(user.id, { isActived: true });
		await this.redisService.del(`verification:${email}`);

		return {
			message: "Email successfully verified!",
			tokens: this.createToken(user),
		};
	}

	async sendForgotPasswordOtp(forgotPasswordDto: ForgotPasswordDto) {
		const { email } = forgotPasswordDto;
		const user = await this.userService.findByEmail(email);
		if (!user || user.githubAccessToken)
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		const otp = this.generateOtp();
		const hashedOtp = await hashPassword(otp);

		this.redisService.set(`forgot-password:${email}`, { hashedOtp }, 60 * 5);
		this.mailService.sendForgotPassword(user, otp);

		return { message: "Password reset OTP has been sent to your email" };
	}

	async resendForgotPasswordOtp(forgotPasswordDto: ForgotPasswordDto) {
		const { email } = forgotPasswordDto;
		const user = await this.userService.findByEmail(email);
		if (!user || user.githubAccessToken)
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		const existingOtp = await this.redisService.get(`forgot-password:${email}`);
		if (existingOtp) throw new BadRequestException(USER_ERRORS.SPAM_OTP);

		return this.sendForgotPasswordOtp({ email });
	}

	async verifyForgotPasswordOtp(verifyDto: VerifyOtpDto) {
		const { email, otp } = verifyDto;
		const data = await this.redisService.get<{ hashedOtp: string }>(
			`forgot-password:${email}`,
		);

		if (!data || !(await validatePassword(otp, data.hashedOtp)))
			throw new BadRequestException(USER_ERRORS.INVALID_OTP);

		const resetToken = this.generateResetToken();
		this.redisService.set(`password-reset:${email}`, { resetToken }, 60 * 15);
		this.redisService.del(`forgot-password:${email}`);

		return {
			message: "OTP verified successfully. You can now reset your password.",
			resetToken,
		};
	}

	async resetPassword(email: string, resetToken: string, newPassword: string) {
		const data = await this.redisService.get<{ resetToken: string }>(
			`password-reset:${email}`,
		);

		if (!data || data.resetToken !== resetToken)
			throw new BadRequestException(TOKEN_ERRORS.INVALID_RESET_TOKEN);

		const user = await this.userService.findByEmail(email);
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		await this.userService.updatePassword(user.id, newPassword);
		await this.redisService.del(`password-reset:${email}`);

		return {
			message: "Password updated successfully",
		};
	}

	async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
		const { oldPassword, newPassword } = updatePasswordDto;

		const user = await this.userService.findById(userId);
		if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

		const isValidPassword = await validatePassword(oldPassword, user.password);
		if (!isValidPassword)
			throw new BadRequestException(USER_ERRORS.INVALID_OLD_PASSWORD);

		await this.userService.updatePassword(user.id, newPassword);

		return { message: "Password updated successfully" };
	}

	private createToken(user: User) {
		const payload = {
			id: user.id,
			role: user.role,
		};

		const refresh = {
			id: user.id,
		};

		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(refresh, {
				secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
				expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRED"),
			}),
		};
	}

	private generateOtp(): string {
		return Math.floor(1000 + Math.random() * 9000).toString();
	}

	private generateResetToken(): string {
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
	}
}
