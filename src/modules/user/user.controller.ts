import { Body, Controller, Post } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@ApiOperation({ summary: "create new user" })
	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return await this.userService.createUser(createUserDto);
	}
}
