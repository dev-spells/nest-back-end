import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { SpellBook } from "src/entities/spellbook.entity";

import { CreateSpellBookDto } from "./dto/create-spell-book.dto";
import { UpdateSpellBookDto } from "./dto/update-spell-book.dto";

@Injectable()
export class SpellBookService {
	constructor(
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

	async findAll(search?: string) {
		// Refactor this later with user data
		// find all the spell book with that lessonId and filter it with the search

		const whereCondition = search ? { name: ILike(`%${search}%`) } : {};

		return await this.spellBookRepository.find({
			select: ["id", "name"],
			where: whereCondition,
			order: { id: "DESC" },
		});
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
