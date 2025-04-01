import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Lesson } from "./lesson.entity";

@Entity()
export class QuizExercise {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })
	question: string;

	@Column({ type: "text" })
	answer: string;

	@OneToOne(() => Lesson, lesson => lesson.quizExercise, {
		onDelete: "CASCADE",
	})
	lesson: Lesson;
}
