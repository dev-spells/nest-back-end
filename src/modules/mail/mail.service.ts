import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserConfirmation(user: User, token: string) {
		const url = `${token}`;

		await this.mailerService.sendMail({
			to: user.email,
			subject: "Welcome to Nice App! Confirm your Email",
			template: "./confirmation", // `.hbs` extension is appended automatically
			context: {
				name: user.username,
				url,
			},
		});
	}
}
