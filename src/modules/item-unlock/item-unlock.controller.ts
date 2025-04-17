import { Body, Controller, Param, Patch, Post } from "@nestjs/common";

import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import { UseItemUnlockDto } from "./dto/create-item-unlock";
import { UpdateItemUnlockDto } from "./dto/update-item-unlock.dto";
import { ItemUnlockService } from "./item-unlock.service";

@ApiTags("Item-unlock")
@Controller("item-unlock")
export class ItemUnlockController {
	constructor(private readonly itemUnlockService: ItemUnlockService) {}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update item unlock solution and chatbot - ADMIN" })
	@ApiBearerAuth()
	@Patch(":id")
	async update(
		@Param("id") itemId: string,
		@Body() updateItemUnlockDto: UpdateItemUnlockDto,
	) {
		return this.itemUnlockService.update(+itemId, updateItemUnlockDto);
	}

	@ApiOperation({ summary: "Use item unlock solution and chatbot" })
	@ApiBearerAuth()
	@Post(":id")
	async use(
		@User() user: any,
		@Param("id") itemId: string,
		@Body() useItemUnlockDto: UseItemUnlockDto,
	) {
		return this.itemUnlockService.use(
			user.id,
			+itemId,
			useItemUnlockDto.lessonId,
		);
	}

	@ApiOperation({
		summary:
			"Check if item unlock solution and chatbot are in use. True if in use",
	})
	@ApiBearerAuth()
	@Post("check/:id")
	async check(
		@User() user: any,
		@Param("id") itemId: string,
		@Body() useItemUnlockDto: UseItemUnlockDto,
	) {
		return this.itemUnlockService.check(
			user.id,
			+itemId,
			useItemUnlockDto.lessonId,
		);
	}
}
