import { join } from "path";

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get<string>("MAIL_HOST"),
					secure: false,
					port: 587,
					auth: {
						user: config.get<string>("MAIL_USER"),
						pass: config.get<string>("MAIL_PASSWORD"),
					},
				},
				defaults: {
					from: `"DevSpells" <${config.get<string>("MAIL_USER")}>`,
				},
				template: {
					dir: join(__dirname, "templates"),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [MailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
