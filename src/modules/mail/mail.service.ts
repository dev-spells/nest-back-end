import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { User } from "src/entities/user.entity";

import { MailTemplates } from "./templates";

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
	) {}

	private async sendMail(
		to: string,
		template: keyof typeof MailTemplates,
		context: Record<string, any>,
	) {
		const mailTemplate = MailTemplates[template];
		await this.mailerService.sendMail({
			to,
			subject: mailTemplate.subject,
			template: mailTemplate.templatePath,
			context,
		});
	}

	async sendUserConfirmation(user: User, otp: string) {
		await this.sendMail(user.email, "USER_CONFIRMATION", {
			name: user.username,
			otp,
		});
	}

	async sendForgotPassword(user: User, otp: string) {
		await this.sendMail(user.email, "FORGOT_PASSWORD", {
			otp,
		});
	}
}
