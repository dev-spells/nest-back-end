import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

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

import { AddItemInShopDto } from "./dto/create-shop.dto";
import {
	BuySellItemDto,
	GetShopResponseDto,
	ShopItemDto,
} from "./dto/response-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";
import { ShopService } from "./shop.service";

@ApiTags("Shop")
@Controller("shop")
export class ShopController {
	constructor(private readonly shopService: ShopService) {}

	@ApiOperation({ summary: "Get all items in shop" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: [GetShopResponseDto] })
	@Get()
	async getAll(@User() user: any) {
		return await this.shopService.getAll(user.id);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "update prices of item in shop" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: ShopItemDto })
	@ApiNotFoundResponse({ description: "Item not found" })
	@Patch(":id")
	async updatePrices(
		@Param("id") id: string,
		@Body() updateShopDto: UpdateShopDto,
	) {
		return await this.shopService.updatePrice(+id, updateShopDto);
	}

	@ApiOperation({ summary: "buy item in shop" })
	@ApiBearerAuth()
	@ApiCreatedResponse({ type: BuySellItemDto })
	@ApiNotFoundResponse({ description: "Item not found or not found in shop" })
	@ApiBadRequestResponse({ description: "Not enough money or not enough item" })
	@Post("buy/:id")
	async buyItem(@User() user: any, @Param("id") id: string) {
		return await this.shopService.buy(user.id, +id);
	}

	@ApiOperation({ summary: "sell item in shop" })
	@ApiBearerAuth()
	@ApiCreatedResponse({ type: BuySellItemDto })
	@ApiNotFoundResponse({ description: "Item not found or not found in shop" })
	@ApiBadRequestResponse({ description: "Not enough money or not enough item" })
	@Post("sell/:id")
	async sellItem(@User() user: any, @Param("id") id: string) {
		return await this.shopService.sell(user.id, +id);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "add item to shop" })
	@ApiBearerAuth()
	@ApiCreatedResponse({ type: ShopItemDto })
	@ApiNotFoundResponse({ description: "Item not found" })
	@ApiBadRequestResponse({ description: "Item already exists" })
	@Post(":id")
	async addItem(
		@Param("id") id: string,
		@Body() addItemInShopDto: AddItemInShopDto,
	) {
		return await this.shopService.addItem(+id, addItemInShopDto);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "remove item in shop" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiNotFoundResponse({ description: "Item not found" })
	@Delete(":id")
	async deleteItem(@Param("id") id: string) {
		return await this.shopService.removeItem(+id);
	}
}
