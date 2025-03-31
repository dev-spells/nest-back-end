import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { Chapter } from "src/entities/chapter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseService } from "../course/course.service";

@Injectable()
export class ChapterService {
	constructor(
		@InjectRepository(Chapter)
		private chapterRepository: Repository<Chapter>,
		private courseService: CourseService,
	) {}

	async create(createChapterDto: CreateChapterDto) {
		const { courseId, name } = createChapterDto;
		await this.courseService.isCourseExists(courseId);

		const chapter = this.chapterRepository.create(createChapterDto);
		return this.chapterRepository.save(chapter);
	}

	async update(id: number, updateChapterDto: UpdateChapterDto) {
		const chapter = await this.findOne(id);
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		return this.chapterRepository.update(chapter.id, { ...updateChapterDto });
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
		return chapter;
	}

	async remove(id: number) {
		const chapter = this.chapterRepository.findOneBy({ id });
		if (!chapter) {
			throw new NotFoundException(`Chapter with id ${id} not found`);
		}
		await this.chapterRepository.delete(id);
		return { message: `Chapter with id ${id} deleted` };
	}
}
