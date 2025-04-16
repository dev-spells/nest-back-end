import { Controller, Get } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { ApiTags } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { ItemProtectStreakService } from "./item-protect-streak.service";

@ApiTags("item-protect-streak")
@Controller("item-protect-streak")
export class ItemProtectStreakController {
	constructor(
		private readonly itemProtectStreakService: ItemProtectStreakService,
	) {}

	@Cron("0 0 * * *", {
		timeZone: "UTC",
	})
	async handleCron() {
		console.log("Running cron job to protect streaks...");
	}

	@Public()
	@Get()
	async getAll() {
		return await this.itemProtectStreakService.handleCron();
	}
}
