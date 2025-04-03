import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EXERCISE_ERRORS } from "src/constants/errors";
import { CodingExercise } from "src/entities/coding-exercise.entity";
import { CodingExerciseSnippet } from "src/entities/coding-exercise-snippet.entity";

import { CreateCodingExerciseDto } from "./dto/create-exercise.dto";
import {
	UpdateCodingExerciseDto,
	UpdateCodingSnippetDto,
} from "./dto/update-exercise.dto";

@Injectable()
export class CodingExerciseService {
	constructor(
		@InjectRepository(CodingExercise)
		private codingExerciseRepository: Repository<CodingExercise>,
		@InjectRepository(CodingExerciseSnippet)
		private codingExerciseSnippetRepository: Repository<CodingExerciseSnippet>,
	) {}
	async create(createCodingExerciseDto: CreateCodingExerciseDto) {
		const { answer, codingSnippets, language } = createCodingExerciseDto;

		const savedCodingExercise = await this.codingExerciseRepository.save({
			language,
			correctAnswer: answer,
		});

		const snippets = await this.codingExerciseSnippetRepository.save(
			codingSnippets.map(snippet => ({
				...snippet,
				codingExercise: savedCodingExercise,
			})),
		);
		return snippets;
	}

	async findAll(exerciseId: number) {
		const snippets = await this.codingExerciseSnippetRepository.find({
			where: {
				codingExercise: { id: exerciseId },
			},
		});

		return snippets;
	}

	async update(id: number, updateCodingExerciseDto: UpdateCodingExerciseDto) {
		const { answer, language } = updateCodingExerciseDto;
		const exercise = await this.codingExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.NOT_FOUND);
		}
		return await this.codingExerciseRepository.update(id, {
			correctAnswer: answer,
			language,
		});
	}

	async updateSnippet(
		id: number,
		updateCodingSnippetDto: UpdateCodingSnippetDto,
	) {
		const { snippet, solutionSnippet, fileName } = updateCodingSnippetDto;
		const codingSnippet = await this.codingExerciseSnippetRepository.findOne({
			where: { id },
		});
		if (!codingSnippet) {
			throw new Error(EXERCISE_ERRORS.SNIPPET_NOT_FOUND);
		}
		return await this.codingExerciseSnippetRepository.update(id, {
			snippet,
			solutionSnippet,
			fileName,
		});
	}

	async deleteExercise(id: number) {
		const exercise = await this.codingExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new Error(EXERCISE_ERRORS.NOT_FOUND);
		}
		return await this.codingExerciseRepository.delete(id);
	}

	async deleteCodingSnippet(id: number) {
		const codingSnippet = await this.codingExerciseSnippetRepository.findOne({
			where: { id },
		});
		if (!codingSnippet) {
			throw new Error(EXERCISE_ERRORS.SNIPPET_NOT_FOUND);
		}
		return await this.codingExerciseSnippetRepository.delete(id);
	}
}
