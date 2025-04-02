import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MultipleChoiceExercise } from "src/entities/multiple-choice-exercise.entity";

import { CreateMultipleChoiceExerciseDto } from "./dto/create-exercise.dto";
import { UpdateMultipleChoiceExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class MultipleChoiceExerciseService {
	constructor(
		@InjectRepository(MultipleChoiceExercise)
		private multipleChoiceExerciseRepository: Repository<MultipleChoiceExercise>,
	) {}

	async create(
		createMultipleChoiceExerciseDto: CreateMultipleChoiceExerciseDto,
	) {
		const { question, options, answer } = createMultipleChoiceExerciseDto;
		const exercise = this.multipleChoiceExerciseRepository.create({
			question,
			options,
			answer,
		});
		return await this.multipleChoiceExerciseRepository.save(exercise);
	}

	async update(
		id: number,
		updateMultipleChoiceExerciseDto: UpdateMultipleChoiceExerciseDto,
	) {
		const { question, options, answer } = updateMultipleChoiceExerciseDto;
		const exercise = await this.multipleChoiceExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new NotFoundException("Exercise not found");
		}
		return await this.multipleChoiceExerciseRepository.update(id, {
			question,
			options,
			answer,
		});
	}

	async delete(id: number) {
		const exercise = await this.multipleChoiceExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new NotFoundException("Exercise not found");
		}
		return await this.multipleChoiceExerciseRepository.delete(id);
	}
}
