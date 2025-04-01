import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CodingExercise } from "src/entities/coding-exercise.entity";
import { CodingExerciseSnippet } from "src/entities/coding-exercise-snippet.entity";
import { Lesson } from "src/entities/lesson.entity";
import { MultipleChoiceExercise } from "src/entities/multiple-choice-exercise.entity";
import { QuizExercise } from "src/entities/quiz-exercise.entity";
import { SpellBook } from "src/entities/spellbook.entity";

import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
	constructor(
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
	) {}

	create(createLessonDto: CreateLessonDto) {
		return "This action adds a new lesson";
	}

	findAll() {
		return `This action returns all lesson`;
	}

	findOne(id: number) {
		return `This action returns a #${id} lesson`;
	}

	update(id: number, updateLessonDto: UpdateLessonDto) {
		return `This action updates a #${id} lesson`;
	}

	remove(id: number) {
		return `This action removes a #${id} lesson`;
	}
}
