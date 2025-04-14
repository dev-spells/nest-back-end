import { Controller, Get } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Roles } from "src/decorators/role-route";

import { Role } from "./../../constants/role.enum";
import { ItemResponse } from "./dto/respose-item.dto";
import { ItemService } from "./item.service";

@ApiTags("item")
@Controller("item")
export class ItemController {
	constructor(private readonly itemService: ItemService) {}

	@Roles(Role.ADMIN)
	@ApiOperation({
		summary: "Get all items with their details",
	})
	@ApiOkResponse({ type: [ItemResponse] })
	@ApiBearerAuth()
	@Get()
	async getAll() {
		return await this.itemService.getAll();
	}
}
