import { Body, Controller, Get, Patch, Post } from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import {
	UseXPPotionResponseDto,
	XpPotionResponseDto,
} from "./dto/reponse-item-xp.dto";
import { UpdateItemXPDto } from "./dto/update-item-xp.dto";
import { ItemXpService } from "./item-xp.service";

@ApiTags("Item-xp")
@Controller("item-xp")
export class ItemXpController {
	constructor(private readonly itemXpService: ItemXpService) {}

	@ApiOperation({ summary: "Get item" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: XpPotionResponseDto })
	@ApiNotFoundResponse({ description: "Item not found" })
	@Get()
	async get() {
		return this.itemXpService.get();
	}

	@ApiOperation({ summary: "Use item XP" })
	@ApiBearerAuth()
	@ApiCreatedResponse({ type: UseXPPotionResponseDto })
	@ApiNotFoundResponse()
	@ApiBadRequestResponse()
	@Post()
	async use(@User() user: any) {
		return this.itemXpService.use(user.id);
	}

	@Roles(Role.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Update item XP - ADMIN" })
	@Patch()
	async update(@Body() updateItemXPDto: UpdateItemXPDto) {
		return this.itemXpService.update(updateItemXPDto);
	}

	@ApiOperation({ summary: "Check item in used or not" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: UseXPPotionResponseDto || null })
	@Get("check")
	async check(@User() user: any) {
		return this.itemXpService.check(user.id);
	}
}
