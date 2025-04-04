import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";

import { CreateCourseDto } from "./dto/create-course.dto";
import { ResponseCourseDto } from "./dto/response-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseService } from "./course.service";

@Controller("course")
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Post()
	@Public()
	@ApiOperation({ summary: "Create new course" })
	@ApiResponse({ status: 201, description: "Create course succesfull" })
	@ApiResponse({ status: 400, description: "Error create course" })
	create(@Body() createCourseDto: CreateCourseDto) {
		return this.courseService.create(createCourseDto);
	}

	@Get()
	@Public()
	@ApiOperation({ summary: "Get all courses" })
	@ApiResponse({
		status: 200,
		description: "Get all courses succesfull",
		type: [ResponseCourseDto],
	})
	findAll() {
		return this.courseService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get course by id" })
	@ApiResponse({
		status: 200,
		description: "Get course by id succesfull",
		type: ResponseCourseDto,
	})
	@ApiResponse({ status: 404, description: "Course not found" })
	@Public()
	findOne(@Param("id") id: string) {
		return this.courseService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this.courseService.update(+id, updateCourseDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.courseService.remove(+id);
	}
}
