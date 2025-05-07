import { Body, Controller, Get, Param, Patch } from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Roles } from "src/decorators/role-route";

import { Role } from "./../../constants/role.enum";
import { ItemResponse } from "./dto/respose-item.dto";
import { updateItemDto } from "./dto/update-item.dto";
import { ItemService } from "./item.service";

@ApiTags("Item")
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

	@Roles(Role.ADMIN)
	@ApiOperation({
		summary: "Update item by id",
	})
	@ApiOkResponse({ type: ItemResponse })
	@ApiNotFoundResponse()
	@ApiBearerAuth()
	@Patch(":id")
	async updateItem(
		@Param("id") id: number,
		@Body() updateItemDto: updateItemDto,
	) {
		return await this.itemService.updateItem(id, updateItemDto);
	}
}
