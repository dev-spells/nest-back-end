import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { GithubOauthGuard } from "../passport/github-oauth.guard";

import { GithubService } from "./github.service";

@ApiTags("Github")
@Controller("github")
export class GithubController {
	constructor(private readonly githubController: GithubService) {}

	@ApiOperation({ summary: "Login with Github, redirect to Github page" })
	@Get()
	@Public()
	@UseGuards(GithubOauthGuard)
	async login() {
		//
	}

	@ApiOperation({ summary: "Github callback, redirect to the app" })
	@Get("callback")
	@Public()
	@UseGuards(GithubOauthGuard)
	async authCallback(@Req() req, @Res() res: Response) {
		const email = req.user.profile.emails?.[0]?.value || `${req.user.username}`;
		return this.githubController.validateUser(
			req.user.profile.username,
			email,
			req.user.accessToken,
			res,
		);
	}
}
