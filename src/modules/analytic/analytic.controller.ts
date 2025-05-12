import { Controller, Get } from "@nestjs/common";

import { Public } from "src/decorators/public-route";

import { AnalyticService } from "./analytic.service";

@Controller("analytic")
export class AnalyticController {
	constructor(private readonly analyticService: AnalyticService) {}

	@Public()
	@Get()
	getAll() {
		return this.analyticService.getAll();
	}
}
