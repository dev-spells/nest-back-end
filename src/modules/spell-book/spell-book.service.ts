import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SpellBook } from "src/entities/spellbook.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { CreateSpellBookDto } from "./dto/create-spell-book.dto";
import { UpdateSpellBookDto } from "./dto/update-spell-book.dto";

@Injectable()
export class SpellBookService {
	constructor(
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(SpellBook)
		private spellBookRepository: Repository<SpellBook>,
	) {}

	async create(lessonId: number, createSpellBookDto: CreateSpellBookDto) {
		const { name, content } = createSpellBookDto;
		const newSpellBook = this.spellBookRepository.create({
			name,
			content,
			lessonId: lessonId,
		});
		return await this.spellBookRepository.save(newSpellBook);
	}

	async findAll(userId: string, search?: string, isAdmin: boolean = false) {
		if (isAdmin) {
			return await this.spellBookRepository.find({
				select: {
					id: true,
					name: true,
				},
			});
		}

		const lessonProgress = await this.userLessonProgressRepository.find({
			select: {
				lesson: {
					id: true,
					spellBook: {
						id: true,
						name: true,
					},
				},
			},
			where: { userId: userId },
			relations: {
				lesson: {
					spellBook: true,
				},
			},
		});
		console.log(lessonProgress);
		const spellBook = lessonProgress
			.map(lesson => {
				if (lesson.lesson.spellBook !== null) {
					return {
						id: lesson.lesson.spellBook.id,
						name: lesson.lesson.spellBook.name,
					};
				}
				return null;
			})
			.filter((item): item is { id: number; name: string } => item !== null);
		if (search) {
			return spellBook.filter(sb => {
				return sb?.name.toLowerCase().includes(search.toLowerCase());
			});
		}
		return spellBook;
	}

	async findOne(id: number) {
		return await this.spellBookRepository.findOneBy({ id });
	}

	async update(id: number, updateSpellBookDto: UpdateSpellBookDto) {
		const { name, content } = updateSpellBookDto;
		return await this.spellBookRepository.update(id, {
			name,
			content,
		});
	}

	remove(id: number) {
		return this.spellBookRepository.delete(id);
	}
}
