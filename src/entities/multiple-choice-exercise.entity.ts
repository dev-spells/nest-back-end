import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Lesson } from "./lesson.entity";

@Entity()
export class MultipleChoiceExercise {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ type: "text" })
	question: string;

	@Column({ type: "text", array: true })
	options: string[];

	@Column({ type: "text" })
	answer: string;

	@OneToOne(() => Lesson, lesson => lesson.multipleChoiceExercise, {
		onDelete: "CASCADE",
	})
	lesson: Lesson;
}
