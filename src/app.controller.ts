import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./decorators/public-route";
import { RedisService } from "./modules/cache/cache.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Public()
	getHello(): string {
		return this.appService.getHello();
	}
}
