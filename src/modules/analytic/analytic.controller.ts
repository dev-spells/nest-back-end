import { Controller, Get, Query } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { Roles } from "src/decorators/role-route";

import { AnalyticsResponseDto } from "./dto/response-analytic.dto";
import { AnalyticService } from "./analytic.service";

@Controller("analytic")
export class AnalyticController {
	constructor(private readonly analyticService: AnalyticService) {}

	@Roles(Role.ADMIN)
	@ApiBearerAuth()
	@Get()
	@ApiOperation({ summary: "Get analytics data with optional time grouping" })
	@ApiQuery({
		name: "groupBy",
		enum: ["day", "month", "year"],
		required: false,
		description: "Group data by time period (day/month/year)",
	})
	@ApiOkResponse({ type: AnalyticsResponseDto })
	getAll(@Query("groupBy") groupBy?: string) {
		return this.analyticService.getAll(
			(groupBy as "day" | "month" | "year") || "day",
		);
	}
}
