import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { CodingExercise } from "./coding-exercise.entity";
import { MultipleChoiceExercise } from "./multiple-choice-exercise.entity";
import { QuizExercise } from "./quiz-exercise.entity";
import { SpellBook } from "./spellbook.entity";

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
	@CreateDateColumn()
	updatedAt: Date;

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

	@OneToOne(() => SpellBook, spellBook => spellBook.Lesson, {
		onDelete: "CASCADE",
	})
	spellBook: SpellBook;
}
