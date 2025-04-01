import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { User } from "src/entities/user.entity";

import { UserService } from "./../../modules/user/user.service";

@Injectable()
export class GithubService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async validateUser(
		username: string,
		email: string,
		accessToken: string,
		res: Response,
	) {
		const user = await this.userService.findByEmail(email);
		if (user && !user.githubAccessToken) {
			throw new ForbiddenException("User already exists with this email");
		}
		if (user && user.githubAccessToken) {
			user.githubAccessToken = accessToken;
			await this.userService.updateUser(user.id, user);
			const { access_token, refresh_token } = this.createToken(user);
			return res.redirect(
				this.configService.get<string>("REDIRECT_URL") +
					"?at=" +
					access_token +
					"&rt=" +
					refresh_token,
			);
		}

		// For new users
		const uuid = uuidv4();
		const newUser = await this.userService.createUser({
			username: username + "_gh",
			email,
			password: uuid,
			githubAccessToken: accessToken,
			isActived: true,
		});
		const { access_token, refresh_token } = this.createToken(newUser);
		return res.redirect(
			this.configService.get<string>("REDIRECT_URL") +
				"?at=" +
				access_token +
				"&rt=" +
				refresh_token,
		);
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
