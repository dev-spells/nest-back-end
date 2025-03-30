import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { Course } from "src/entities/course.entity";

import { S3Service } from "../s3/s3.service";

import { CreateCourseDto } from "./dto/create-course.dto";
import { ResponseCourseDto } from "./dto/response-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		private s3Service: S3Service,
	) {}

	async create(createCourseDto: CreateCourseDto) {
		const course = this.courseRepository.create(createCourseDto);
		if (!course) {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, message: "Error create course" },
				HttpStatus.BAD_REQUEST,
			);
		}
		return plainToInstance(
			ResponseCourseDto,
			await this.courseRepository.save(course),
		);
	}

	async findAll() {
		return plainToInstance(
			ResponseCourseDto,
			await this.courseRepository.find(),
		);
	}

	async findOne(id: number) {
		const course = await this.courseRepository.findOne({
			where: { id },
		});
		if (!course) {
			throw new HttpException(
				{ status: HttpStatus.NOT_FOUND, message: "Course not found" },
				HttpStatus.NOT_FOUND,
			);
		}
		return plainToInstance(ResponseCourseDto, course);
	}

	update(id: number, updateCourseDto: UpdateCourseDto) {
		return `This action updates a #${id} course`;
	}

	remove(id: number) {
		return `This action removes a #${id} course`;
	}
}
