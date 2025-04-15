import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { CodingExercise } from "./coding-exercise.entity";

@Entity()
export class CodingExerciseSnippet {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	fileName: string;

	@Column({ type: "text" })
	snippet: string;

	@Column({ type: "text", nullable: true })
	solutionSnippet: string;

	@Column()
	codingExerciseId: number;

	@ManyToOne(() => CodingExercise, codingExercise => codingExercise.snippets, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "codingExerciseId" })
	codingExercise: CodingExercise;
}
