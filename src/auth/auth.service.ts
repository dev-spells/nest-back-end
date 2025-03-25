import {
	BadGatewayException,
	BadRequestException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { UserService } from "src/modules/user/user.service";
import { validatePassword } from "src/utils/handle-password.util";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.userService.findByUsername(username);
		if (!user) return null;

		const isValidPassword = await validatePassword(pass, user.password);

		if (!isValidPassword) return null;
		return this.createToken(user);
	}

	async refreshAccessToken(req: any) {
		const { id } = req;
		const user = await this.userService.findById(id);

		if (!user) throw new UnauthorizedException("Not found user");

		return this.createToken(user);
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
}
