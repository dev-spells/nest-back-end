import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./passport/jwt.strategy";
import { RefreshStrategy } from "./passport/refresh.strategy";
import { UserModule } from "src/modules/user/user.module";
import { LocalStrategy } from "./passport/local.strategy";

@Module({
	imports: [
		UserModule,
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				global: true,
				secret: configService.get<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: configService.get<string>("JWT_ACCESS_TOKEN_EXPIRED"),
				},
			}),
			inject: [ConfigService],
		}),
		PassportModule,
	],

	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, RefreshStrategy, LocalStrategy],
})
export class AuthModule {}
