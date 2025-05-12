import { Controller, Get, Query } from "@nestjs/common";

import { ApiOperation, ApiQuery } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { AnalyticService } from "./analytic.service";

@Controller("analytic")
export class AnalyticController {
	constructor(private readonly analyticService: AnalyticService) {}

	@Public()
	@Get()
	@ApiOperation({ summary: "Get analytics data with optional time grouping" })
	@ApiQuery({
		name: "groupBy",
		enum: ["day", "month", "year"],
		required: false,
		description: "Group data by time period (day/month/year)",
	})
	getAll(@Query("groupBy") groupBy?: string) {
		return this.analyticService.getAll(
			(groupBy as "day" | "month" | "year") || "day",
		);
	}
}
