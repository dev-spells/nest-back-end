import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import { CreateUserDto } from "./dto/create-user.dto";
import {
	UserDetailResponseDto,
	UserGeneralInfoResponseDto,
	UserStreakResponseDto,
} from "./dto/response-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: "get user streak" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: UserStreakResponseDto })
	@Get("streak")
	async getStreak(@User() user: any) {
		return await this.userService.getUserStreak(user.id);
	}

	@ApiOperation({ summary: "get user course completed" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: UserDetailResponseDto })
	@ApiNotFoundResponse({ description: "User course completed not found" })
	@Get("course-completed/:id")
	async getUserCourseCompleted(@Param("id") id: string) {
		return await this.userService.getUserCourseCompleted(id);
	}

	@ApiOperation({ summary: "get user detail info" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: UserDetailResponseDto })
	@ApiNotFoundResponse({ description: "User not found" })
	@Get(":id")
	async getUserDetail(@User() user: any, @Param("id") id: string) {
		return await this.userService.getDetail(user.id, id);
	}

	@ApiOperation({ summary: "get user general info" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: UserGeneralInfoResponseDto })
	@ApiNotFoundResponse({ description: "User not found" })
	@Get()
	async getUser(@User() user: any) {
		return await this.userService.get(user.id);
	}

	@ApiOperation({ summary: "create new user" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return await this.userService.createUser(createUserDto);
	}

	@ApiOperation({ summary: "update user info" })
	@ApiBearerAuth()
	@ApiNotFoundResponse({ description: "User not found" })
	@ApiBadRequestResponse({ description: "Invalid data" })
	@Patch()
	async update(@User() user: any, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.updateUser(user.id, updateUserDto);
	}
}
