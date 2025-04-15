import { Controller } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { ApiTags } from "@nestjs/swagger";

import { ItemProtectStreakService } from "./item-protect-streak.service";

@ApiTags("item-protect-streak")
@Controller("item-protect-streak")
export class ItemProtectStreakController {
	constructor(
		private readonly itemProtectStreakService: ItemProtectStreakService,
	) {}

	@Cron("59 23 * * *")
	async handleCron() {
		console.log("Running cron job to protect streaks...");
	}
}
