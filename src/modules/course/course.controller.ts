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
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import { CreateCourseDto } from "./dto/create-course.dto";
import {
	ResponseCourseDetailDto,
	ResponseCourseDto,
} from "./dto/response-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseService } from "./course.service";

@Controller("course")
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Create new course - ADMIN" })
	@ApiResponse({ status: 201, description: "Create course succesfull" })
	@ApiResponse({ status: 400, description: "Error create course" })
	@Roles(Role.ADMIN)
	@Post()
	create(@Body() createCourseDto: CreateCourseDto) {
		return this.courseService.create(createCourseDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Get all courses" })
	@ApiResponse({
		status: 200,
		description: "Get all courses succesfull",
		type: [ResponseCourseDto],
	})
	@Get()
	findAll(@User() user: any) {
		return this.courseService.findAll(user.id);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Get course by id" })
	@ApiOkResponse({
		description: "Get course by id succesfull",
		type: ResponseCourseDetailDto,
	})
	@ApiNotFoundResponse({ description: "Course not found" })
	@Get(":id")
	findOne(@User() user: any, @Param("id") id: string) {
		return this.courseService.findOne(+id, user.id);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Update course by id - ADMIN" })
	@ApiOkResponse({
		description: "Update course by id succesfull",
		type: ResponseCourseDto,
	})
	@ApiNotFoundResponse({ description: "Course not found" })
	@Roles(Role.ADMIN)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this.courseService.update(+id, updateCourseDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete course by id - ADMIN" })
	@ApiOkResponse({ description: "Delete course by id succesfull" })
	@ApiNotFoundResponse({ description: "Course not found" })
	@Roles(Role.ADMIN)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.courseService.remove(+id);
	}
}
