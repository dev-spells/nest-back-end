import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Chapter } from "src/entities/chapter.entity";
import { Lesson } from "src/entities/lesson.entity";

import { CourseService } from "../course/course.service";

import { CreateBatchChaptersDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {
	constructor(
		@InjectRepository(Chapter)
		private chapterRepository: Repository<Chapter>,
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
		private courseService: CourseService,
	) {}

	async createBatchChapters(createBatchChaptersDto: CreateBatchChaptersDto) {
		const { courseId, chapters } = createBatchChaptersDto;
		await this.courseService.isCourseExists(courseId);

		const chapterEntities = chapters.map(chapterDto =>
			this.chapterRepository.create({
				name: chapterDto.name,
				course: { id: courseId },
			}),
		);

		return await this.chapterRepository.save(chapterEntities);
	}

	// async create(createChapterDto: CreateChapterDto) {
	// 	const { courseId, name } = createChapterDto;
	// 	await this.courseService.isCourseExists(courseId);

	// 	const chapter = this.chapterRepository.create(createChapterDto);
	// 	return this.chapterRepository.save(chapter);
	// }

	async update(id: number, updateChapterDto: UpdateChapterDto) {
		const chapter = await this.chapterRepository.findOneBy({ id });
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		return this.chapterRepository.update(chapter.id, {
			...updateChapterDto,
		});
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
		const chapter = await this.chapterRepository.findOneBy({ id });
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		await this.chapterRepository.delete(id);
		return { message: `Chapter with id ${id} deleted` };
	}
}
