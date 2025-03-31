import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
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
			throw new BadRequestException("Error create course");
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
			throw new NotFoundException("Course not found");
		}
		return plainToInstance(ResponseCourseDto, course);
	}

	async isCourseExists(id: number) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException("Course not found");
		}
		return true;
	}

	update(id: number, updateCourseDto: UpdateCourseDto) {
		return `This action updates a #${id} course`;
	}

	remove(id: number) {
		return `This action removes a #${id} course`;
	}
}
