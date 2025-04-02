import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { CodingExerciseSnippet } from "./coding-exercise-snippet.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class CodingExercise {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })
	correctAnswer: string;

	@Column({ type: "varchar" })
	language: string;

	@OneToMany(() => CodingExerciseSnippet, snippet => snippet.codingExercise, {
		onDelete: "CASCADE",
	})
	snippets: CodingExerciseSnippet[];

	@OneToOne(() => Lesson, lesson => lesson.codingExercise, {
		onDelete: "CASCADE",
	})
	lesson: Lesson;
}
