import { Expose } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CodingExercise } from "./coding-exercise.entity";

@Entity()
export class CodingExerciseSnippet {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	fileName: string;

	@Column({ type: "text" })
	snippet: string;

	@Column({ type: "text" })
	solutionSnippet: string;

	@ManyToOne(() => CodingExercise, codingExercise => codingExercise.snippets, {
		onDelete: "CASCADE",
	})
	codingExercise: CodingExercise;
}
