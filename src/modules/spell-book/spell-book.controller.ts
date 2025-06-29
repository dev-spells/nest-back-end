import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Query,
} from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import {
	ResponseDetailSpellBook,
	ResponseSpellBook,
} from "./dto/response-spell-book.dto";
import { UpdateSpellBookDto } from "./dto/update-spell-book.dto";
import { SpellBookService } from "./spell-book.service";

@Controller("spell-book")
export class SpellBookController {
	constructor(private readonly spellBookService: SpellBookService) {}

	@ApiOperation({ summary: "Search spell book" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: [ResponseSpellBook] })
	@ApiQuery({
		name: "search",
		required: false,
	})
	@ApiQuery({
		name: "isAdmin",
		required: false,
	})
	@Get()
	findAll(
		@User() user: any,
		@Query("search") search: string,
		@Query("isAdmin") isAdmin: boolean,
	) {
		return this.spellBookService.findAll(user.id, search, isAdmin);
	}

	@ApiOperation({ summary: "Show details of a spell book" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: ResponseDetailSpellBook })
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.spellBookService.findOne(+id);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update a spell book" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateSpellBookDto: UpdateSpellBookDto,
	) {
		return this.spellBookService.update(+id, updateSpellBookDto);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Hard delete a spell book" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.spellBookService.remove(+id);
	}
}
