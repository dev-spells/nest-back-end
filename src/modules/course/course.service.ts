import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { COURSE_ERRORS } from "src/constants/errors";
import { Course } from "src/entities/course.entity";
import { extractS3Key } from "src/utils/extract-s3-key.util";

import { CodingExerciseService } from "../exercise/coding-exercise.service";
import { MultipleChoiceExerciseService } from "../exercise/multiple-choice-exercise.service";
import { QuizExerciseService } from "../exercise/quiz-exercise.service";

import { S3Service } from "./../s3/s3.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		private s3Service: S3Service,
		private codingExerciseService: CodingExerciseService,
		private multipleChoiceExerciseService: MultipleChoiceExerciseService,
		private quizExerciseService: QuizExerciseService,
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

	async findAll(userId: string) {
		const courses = await this.courseRepository.find({
			order: { createdAt: "ASC" },
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

		const completedLessonsQuery = await this.courseRepository
			.createQueryBuilder("course")
			.leftJoin("course.chapters", "chapter")
			.leftJoin("chapter.lessons", "lesson")
			.leftJoin(
				"lesson.userLessonProgress",
				"userLessonProgress",
				"userLessonProgress.userId = :userId",
				{ userId },
			)
			.select("course.id", "courseId")
			.addSelect(
				"COUNT(DISTINCT userLessonProgress.lessonId)",
				"completedLessonsCount",
			)
			.where("course.id IN (:...courseIds)", { courseIds })
			.groupBy("course.id")
			.getRawMany();
		const completedLessonsMap = new Map(
			completedLessonsQuery.map(item => [
				item.courseId,
				parseInt(item.completedLessonsCount),
			]),
		);

		const chapterNamesQuery = await this.courseRepository
			.createQueryBuilder("course")
			.innerJoin("course.chapters", "chapter")
			.select("course.id", "courseId")
			.addSelect("chapter.id", "chapterId")
			.addSelect("chapter.name", "chapterName")
			.where("course.id IN (:...courseIds)", { courseIds })
			.orderBy("chapter.pos", "ASC")
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
			course.completedLessonsCount = completedLessonsMap.get(course.id) || 0;
			course.chaptersList = chaptersByCoursesMap.get(course.id) || [];
		}
		return courses;
	}

	async findOne(id: number, userId: string) {
		const course = await this.courseRepository.findOne({ where: { id } });
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}

		const rawChaptersAndLessons = await this.courseRepository
			.createQueryBuilder("course")
			.innerJoin("course.chapters", "chapter")
			.leftJoin("chapter.lessons", "lesson")
			.leftJoin(
				"lesson.userLessonProgress",
				"userLessonProgress",
				"userLessonProgress.userId = :userId",
				{ userId },
			)
			.select("course.id", "courseId")
			.addSelect("chapter.id", "chapterId")
			.addSelect("chapter.name", "chapterName")
			.addSelect("chapter.pos", "chapterPos")
			.addSelect("lesson.id", "lessonId")
			.addSelect("lesson.name", "lessonName")
			.addSelect("lesson.difficulty", "lessonDifficulty")
			.addSelect(
				"CASE WHEN userLessonProgress.userId IS NOT NULL THEN true ELSE false END",
				"lessonCompleted",
			)
			.where("course.id = :courseId", { courseId: id })
			.orderBy("chapter.pos", "ASC")
			.addOrderBy("lesson.createdAt", "ASC")
			.getRawMany();

		const chaptersMap = new Map();

		for (const row of rawChaptersAndLessons) {
			if (!chaptersMap.has(row.chapterId)) {
				chaptersMap.set(row.chapterId, {
					id: row.chapterId,
					name: row.chapterName,
					pos: row.chapterPos,
					lessons: [],
				});
			}

			if (row.lessonId) {
				chaptersMap.get(row.chapterId).lessons.push({
					id: row.lessonId,
					name: row.lessonName,
					difficulty: row.lessonDifficulty,
					completed: row.lessonCompleted,
				});
			}
		}

		course.chapters = Array.from(chaptersMap.values());
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
		if (updateCourseDto.iconUrl !== course.iconUrl) {
			const s3Key = extractS3Key(course.iconUrl);
			if (s3Key) {
				this.s3Service.deleteFile(s3Key);
			}
		}
		return await this.courseRepository.update(id, {
			...updateCourseDto,
		});
	}

	async remove(id: number) {
		const course = await this.courseRepository.findOne({
			where: { id },
			relations: {
				chapters: {
					lessons: true,
				},
			},
		});
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		for (const chapter of course.chapters) {
			for (const lesson of chapter.lessons) {
				if (lesson.codingExerciseId) {
					this.codingExerciseService.deleteExercise(lesson.codingExerciseId);
				}
				if (lesson.multipleChoiceExerciseId) {
					this.multipleChoiceExerciseService.delete(
						lesson.multipleChoiceExerciseId,
					);
				}
				if (lesson.quizExerciseId) {
					this.quizExerciseService.delete(lesson.quizExerciseId);
				}
			}
		}

		const s3Key = extractS3Key(course.iconUrl);
		if (s3Key) {
			this.s3Service.deleteFile(s3Key);
		}
		// return await this.courseRepository.update(id, { isDeleted: true });
		return await this.courseRepository.delete(id);
	}
}
