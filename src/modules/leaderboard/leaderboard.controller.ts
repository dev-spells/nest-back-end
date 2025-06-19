import { Controller, Get } from "@nestjs/common";

import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { User } from "src/decorators/current-user";

import {
	LevelLeaderboardResponseDto,
	SubmissionLeaderboardResponseDto,
} from "./dto/response-leaderboard.dto";
import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboard")
export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}
	@ApiOperation({ summary: "Get leaderboard by submission count in day" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: SubmissionLeaderboardResponseDto })
	@Get("submission-daily")
	async getRankSubmissionCountDaily(@User() user: any) {
		return this.leaderboardService.getRankSubmissionCountDaily(user.id);
	}

	@ApiOperation({ summary: "Get leaderboard by highest level" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: LevelLeaderboardResponseDto })
	@Get("highest-level")
	async getRankLevel(@User() user: any) {
		return this.leaderboardService.getRankHighestLevel(user.id);
	}
}
