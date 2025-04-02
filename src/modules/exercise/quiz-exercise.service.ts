import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { QuizExercise } from "src/entities/quiz-exercise.entity";

import { CreateQuizExerciseDto } from "./dto/create-exercise.dto";
import { UpdateQuizExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class QuizExerciseService {
	constructor(
		@InjectRepository(QuizExercise)
		private quizExerciseRepository: Repository<QuizExercise>,
	) {}

	async create(createQuizExerciseDto: CreateQuizExerciseDto) {
		const { question, answer } = createQuizExerciseDto;
		const exercise = this.quizExerciseRepository.create({
			question,
			answer,
		});
		return await this.quizExerciseRepository.save(exercise);
	}

	async update(id: number, updateQuizExerciseDto: UpdateQuizExerciseDto) {
		const { question, answer } = updateQuizExerciseDto;
		const exercise = await this.quizExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new Error("Exercise not found");
		}
		return await this.quizExerciseRepository.update(id, {
			question,
			answer,
		});
	}

	async delete(id: number) {
		const exercise = await this.quizExerciseRepository.findOne({
			where: { id },
		});
		if (!exercise) {
			throw new Error("Exercise not found");
		}
		return await this.quizExerciseRepository.delete(id);
	}
}
