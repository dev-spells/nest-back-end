import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Chapter } from "src/entities/chapter.entity";
import { Lesson } from "src/entities/lesson.entity";

import { CourseService } from "../course/course.service";
import { CodingExerciseService } from "../exercise/coding-exercise.service";
import { MultipleChoiceExerciseService } from "../exercise/multiple-choice-exercise.service";
import { QuizExerciseService } from "../exercise/quiz-exercise.service";

import {
	CreateBatchChaptersDto,
	CreateChapterDto,
} from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {
	constructor(
		@InjectRepository(Chapter)
		private chapterRepository: Repository<Chapter>,
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
		private courseService: CourseService,
		private multipleChoiceExerciseService: MultipleChoiceExerciseService,
		private quizExerciseService: QuizExerciseService,
		private codingExerciseService: CodingExerciseService,
	) {}

	async createBatchChapters(createBatchChaptersDto: CreateBatchChaptersDto) {
		const { courseId, chapters } = createBatchChaptersDto;
		await this.courseService.isCourseExists(courseId);

		let position = 1;
		const chapterEntities = chapters.map(chapterDto =>
			this.chapterRepository.create({
				name: chapterDto.name,
				course: { id: courseId },
				pos: position++,
			}),
		);

		return await this.chapterRepository.save(chapterEntities);
	}

	async create(createChapterDto: CreateChapterDto) {
		const { courseId, name, pos } = createChapterDto;
		await this.courseService.isCourseExists(courseId);

		const chapter = this.chapterRepository.create(createChapterDto);
		return this.chapterRepository.save({
			course: { id: courseId },
			name,
			pos,
		});
	}

	async update(id: number, updateChapterDto: UpdateChapterDto) {
		const chapter = await this.chapterRepository.findOneBy({ id });
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		return this.chapterRepository.update(chapter.id, {
			...updateChapterDto,
		});
	}

	async updateBatchChapters(updateBatchChaptersDto: UpdateChapterDto[]) {
		const snippets = await this.chapterRepository.find({
			where: {
				id: In(updateBatchChaptersDto.map(chapter => chapter.id)),
			},
		});
		if (snippets.length !== updateBatchChaptersDto.length) {
			throw new NotFoundException("Some chapters not found");
		}
		return await this.chapterRepository.save(updateBatchChaptersDto);
	}

	async findAll() {
		const chapters = await this.chapterRepository.find();
		return chapters;
	}

	async findOne(id: number) {
		const chapter = await this.chapterRepository.findOneBy({ id });
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		const lessons = await this.lessonRepository.find({
			select: { id: true, name: true, difficulty: true },
			where: { chapter: { id: chapter.id } },
		});

		return {
			chapter: {
				...chapter,
				lessons,
			},
		};
	}

	async remove(id: number) {
		const chapter = await this.chapterRepository.findOne({
			where: { id },
			relations: { lessons: true },
		});
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
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

		await this.chapterRepository.delete(id);
		return { message: `Chapter with id ${id} deleted` };
	}
}
