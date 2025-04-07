import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { COURSE_ERRORS } from "src/constants/errors";
import { Course } from "src/entities/course.entity";

import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
	) {}

	async create(createCourseDto: CreateCourseDto) {
		const course = await this.courseRepository.findOneBy({
			title: createCourseDto.title,
		});
		if (course) {
			throw new BadRequestException(COURSE_ERRORS.ALREADY_EXISTS);
		}
		return await this.courseRepository.save({ ...createCourseDto });
	}

	async findAll() {
		const courses = await this.courseRepository.find({
			order: { created_at: "ASC" },
		});

		const courseIds = courses.map(course => course.id);

		if (courseIds.length === 0) {
			return [];
		}

		const chaptersCountQuery = await this.courseRepository
			.createQueryBuilder("course")
			.leftJoin("course.chapters", "chapter")
			.select("course.id", "courseId")
			.addSelect("COUNT(DISTINCT chapter.id)", "chaptersCount")
			.where("course.id IN (:...courseIds)", { courseIds })
			.groupBy("course.id")
			.getRawMany();
		const chaptersCountMap = new Map(
			chaptersCountQuery.map(item => [
				item.courseId,
				parseInt(item.chaptersCount),
			]),
		);

		const lessonsCountQuery = await this.courseRepository
			.createQueryBuilder("course")
			.leftJoin("course.chapters", "chapter")
			.leftJoin("lesson", "lesson", "lesson.chapterId = chapter.id")
			.select("course.id", "courseId")
			.addSelect("COUNT(DISTINCT lesson.id)", "lessonsCount")
			.where("course.id IN (:...courseIds)", { courseIds })
			.groupBy("course.id")
			.getRawMany();
		const lessonsCountMap = new Map(
			lessonsCountQuery.map(item => [
				item.courseId,
				parseInt(item.lessonsCount),
			]),
		);

		const chapterNamesQuery = await this.courseRepository
			.createQueryBuilder("course")
			.innerJoin("course.chapters", "chapter")
			.select("course.id", "courseId")
			.addSelect("chapter.id", "chapterId")
			.addSelect("chapter.name", "chapterName")
			.where("course.id IN (:...courseIds)", { courseIds })
			.orderBy("chapter.created_at", "ASC")
			.getRawMany();
		const chaptersByCoursesMap = new Map();
		for (const item of chapterNamesQuery) {
			if (!chaptersByCoursesMap.has(item.courseId)) {
				chaptersByCoursesMap.set(item.courseId, []);
			}
			chaptersByCoursesMap.get(item.courseId).push({
				id: item.chapterId,
				name: item.chapterName,
			});
		}

		for (const course of courses) {
			course.chaptersCount = chaptersCountMap.get(course.id) || 0;
			course.lessonsCount = lessonsCountMap.get(course.id) || 0;
			course.chaptersList = chaptersByCoursesMap.get(course.id) || [];
		}
		return courses;
	}

	async findOne(id: number) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		const chapterNamesQuery = await this.courseRepository
			.createQueryBuilder("course")
			.innerJoin("course.chapters", "chapter")
			.select("course.id", "courseId")
			.addSelect("chapter.id", "chapterId")
			.addSelect("chapter.name", "chapterName")
			.where("course.id = :courseId", { courseId: id })
			.orderBy("chapter.created_at", "ASC")
			.getRawMany();
		const chaptersByCoursesMap = new Map();
		for (const item of chapterNamesQuery) {
			if (!chaptersByCoursesMap.has(item.courseId)) {
				chaptersByCoursesMap.set(item.courseId, []);
			}
			chaptersByCoursesMap.get(item.courseId).push({
				id: item.chapterId,
				name: item.chapterName,
			});
		}
		course.chaptersList = chaptersByCoursesMap.get(course.id) || [];
		return course;
	}

	async isCourseExists(id: number) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		return true;
	}

	async update(id: number, updateCourseDto: UpdateCourseDto) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		return await this.courseRepository.update(id, {
			...updateCourseDto,
		});
	}

	async remove(id: number) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		return await this.courseRepository.update(id, { isDeleted: true });
	}
}
