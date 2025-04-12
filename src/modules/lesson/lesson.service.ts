import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";

import { LESSON_ERRORS } from "src/constants/errors";
import { Lesson, LessonDifficulty } from "src/entities/lesson.entity";

import { SpellBookService } from "../spell-book/spell-book.service";

import { CodingExerciseService } from "./../exercise/coding-exercise.service";
import { MultipleChoiceExerciseService } from "./../exercise/multiple-choice-exercise.service";
import { QuizExerciseService } from "./../exercise/quiz-exercise.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
	constructor(
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
		private codingExerciseService: CodingExerciseService,
		private multipleChoiceExerciseService: MultipleChoiceExerciseService,
		private quizExerciseService: QuizExerciseService,
		private spellBookService: SpellBookService,
	) {}

	async create(createLessonDto: CreateLessonDto) {
		try {
			const {
				codingExercise,
				quizExercise,
				multipleChoiceExercise,
				spellBook,
			} = createLessonDto;

			// Create exercise objects
			let codingExerciseId: number | null = null;
			let quizExerciseId: number | null = null;
			let multipleChoiceExerciseId: number | null = null;

			if (codingExercise) {
				const exercise =
					await this.codingExerciseService.create(codingExercise);
				codingExerciseId = exercise.id;
			} else if (quizExercise) {
				const exercise = await this.quizExerciseService.create(quizExercise);
				quizExerciseId = exercise.id;
			} else if (multipleChoiceExercise) {
				const exercise = await this.multipleChoiceExerciseService.create(
					multipleChoiceExercise,
				);
				multipleChoiceExerciseId = exercise.id;
			} else {
				throw new BadRequestException(LESSON_ERRORS.NOT_FOUND);
			}

			// Create lesson object
			const lesson = this.lessonRepository.create({
				chapter: { id: createLessonDto.chapterId },
				name: createLessonDto.name,
				content: createLessonDto.content,
				difficulty:
					(createLessonDto.difficulty as LessonDifficulty) ||
					LessonDifficulty.EASY,
				codingExerciseId,
				quizExerciseId,
				multipleChoiceExerciseId,
			});
			const savedLesson = await this.lessonRepository.save(lesson);

			// Create spell book object if provided
			const spellBookData = spellBook
				? await this.spellBookService.create(savedLesson.id, spellBook)
				: null;
			return {
				lesson: savedLesson,
				spellBook: spellBookData,
			};
		} catch (error) {
			if (error instanceof QueryFailedError) {
				console.log(error);
				throw new BadRequestException(
					"Invalid chapter ID or exercise data or spellbook data",
				);
			}
			throw error;
		}
	}

	async findAll(chapterId: number) {
		return await this.lessonRepository.find({
			select: ["id", "name"],
			where: { chapter: { id: chapterId } },
		});
	}

	async findOne(id: number) {
		const lesson = await this.lessonRepository.findOne({
			select: [
				"id",
				"name",
				"content",
				"difficulty",
				"codingExercise",
				"quizExercise",
				"multipleChoiceExercise",
			],
			where: { id },
			relations: {
				codingExercise: true,
				quizExercise: true,
				multipleChoiceExercise: true,
			},
		});
		if (!lesson) {
			throw new BadRequestException(LESSON_ERRORS.NOT_FOUND);
		}
		const codingSnippets = lesson?.codingExercise
			? await this.codingExerciseService.findAll(lesson?.codingExercise.id)
			: null;
		return {
			lesson: {
				id: lesson?.id,
				name: lesson?.name,
				content: lesson?.content,
				difficulty: lesson?.difficulty,
			},
			codingExercise: {
				...lesson?.codingExercise,
				codingSnippets,
			},
			quizExercise: lesson?.quizExercise,
			multipleChoiceExercise: lesson?.multipleChoiceExercise,
		};
	}
	async update(id: number, updateLessonDto: UpdateLessonDto) {
		const lesson = await this.lessonRepository.findOne({
			where: { id },
			relations: { chapter: true },
		});

		if (!lesson) {
			throw new BadRequestException(LESSON_ERRORS.NOT_FOUND);
		}

		const updatedLesson = {
			...lesson,
			...updateLessonDto,
		};

		await this.lessonRepository.save(updatedLesson);

		return updatedLesson;
	}

	async remove(id: number) {
		const lesson = await this.lessonRepository.findOne({ where: { id } });

		if (!lesson) {
			throw new BadRequestException(LESSON_ERRORS.NOT_FOUND);
		}
		const codingExerciseId = lesson.codingExerciseId;
		const quizExerciseId = lesson.quizExerciseId;
		const multipleChoiceExerciseId = lesson.multipleChoiceExerciseId;
		if (codingExerciseId) {
			return await this.codingExerciseService.deleteExercise(codingExerciseId);
		}
		if (quizExerciseId) {
			return await this.quizExerciseService.delete(quizExerciseId);
		}
		if (multipleChoiceExerciseId) {
			return await this.multipleChoiceExerciseService.delete(
				multipleChoiceExerciseId,
			);
		}
	}
}
