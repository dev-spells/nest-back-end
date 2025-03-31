import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { RedisModule } from "src/modules/cache/cache.module";
import { MailModule } from "src/modules/mail/mail.module";
import { UserModule } from "src/modules/user/user.module";

import { GithubController } from "./github/github.controller";
import { GithubService } from "./github/github.service";
import { GithubStrategy } from "./passport/github.strategy";
import { JwtStrategy } from "./passport/jwt.strategy";
import { LocalStrategy } from "./passport/local.strategy";
import { RefreshStrategy } from "./passport/refresh.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				global: true,

				secret: configService.get<string>("JWT_SECRET"),

				signOptions: {
					expiresIn: configService.get<string>("JWT_ACCESS_TOKEN_EXPIRED"),
				},
			}),

			inject: [ConfigService],
		}),
		PassportModule,
		MailModule,
		RedisModule,
	],
	controllers: [AuthController, GithubController],
	providers: [
		AuthService,
		GithubService,
		JwtStrategy,
		RefreshStrategy,
		LocalStrategy,
		GithubStrategy,
	],
})
export class AuthModule {}
