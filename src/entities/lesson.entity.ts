import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { Chapter } from "./chapter.entity";
import { CodingExercise } from "./coding-exercise.entity";
import { MultipleChoiceExercise } from "./multiple-choice-exercise.entity";
import { QuizExercise } from "./quiz-exercise.entity";

export enum LessonDifficulty {
	EASY = "EASY",
	MEDIUM = "MEDIUM",
	HARD = "HARD",
}

@Entity()
@Check(`
    ("codingExerciseId" IS NOT NULL)::int +
    ("multipleChoiceExerciseId" IS NOT NULL)::int +
    ("quizExerciseId" IS NOT NULL)::int = 1
`)
export class Lesson {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", nullable: false })
	name: string;

	@Column({ type: "text", nullable: false })
	content: string;

	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;

	@Column({
		type: "enum",
		enum: LessonDifficulty,
		default: LessonDifficulty.EASY,
	})
	difficulty: LessonDifficulty;

	@ManyToOne(() => Chapter, { onDelete: "CASCADE" })
	chapter: Chapter;

	@OneToOne(() => CodingExercise, codingExercise => codingExercise.lesson, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "codingExerciseId" })
	codingExercise: CodingExercise;

	@Column({ nullable: true })
	codingExerciseId: number | null;

	@OneToOne(
		() => MultipleChoiceExercise,
		multipleChoiceExercise => multipleChoiceExercise.lesson,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "multipleChoiceExerciseId" })
	multipleChoiceExercise: MultipleChoiceExercise;

	@Column({ nullable: true })
	multipleChoiceExerciseId: number | null;

	@OneToOne(() => QuizExercise, quizExercise => quizExercise.lesson, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "quizExerciseId" })
	quizExercise: QuizExercise;

	@Column({ nullable: true })
	quizExerciseId: number | null;
}
