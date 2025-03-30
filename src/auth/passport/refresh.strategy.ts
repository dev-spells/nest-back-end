import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey:
				configService.get<string>("JWT_REFRESH_SECRET") || "default-secret",
		});
	}

	async validate(payload: any) {
		return { id: payload.id };
	}
}
