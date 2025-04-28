import { Body, Controller, Patch } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { Roles } from "src/decorators/role-route";

import { UpdateItemProtectStreakDto } from "./dto/update-item-protect-streak.dto";
import { ItemProtectStreakService } from "./item-protect-streak.service";

@ApiTags("Item-protect-streak")
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
		await this.itemProtectStreakService.handleCron();
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update item protect streak - ADMIN" })
	@ApiOkResponse()
	@ApiBearerAuth()
	@Patch()
	async update(@Body() updateItemProtectStreakDto: UpdateItemProtectStreakDto) {
		return await this.itemProtectStreakService.update(
			updateItemProtectStreakDto,
		);
	}
}
