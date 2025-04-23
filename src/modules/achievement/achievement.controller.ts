import { Controller, Get } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { User } from "src/decorators/current-user";

import {
	AchievementProgressResponseDto,
	AchievementResponseDto,
} from "./dto/reponse-achievement.dto";
import { AchievementService } from "./achievement.service";

@ApiTags("Achievement")
@Controller("achievement")
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}

	@ApiOperation({ summary: "Get user achievement progress" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: AchievementProgressResponseDto })
	@Get("progress")
	async getAchievementProgress(@User() user: any) {
		return await this.achievementService.getAchievementProgress(user.id);
	}

	@ApiOperation({ summary: "Get user achievements" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: [AchievementResponseDto] })
	@Get()
	async getAchievements(@User() user: any) {
		return await this.achievementService.getALl(user.id);
	}
}
