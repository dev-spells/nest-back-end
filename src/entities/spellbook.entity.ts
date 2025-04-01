import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Lesson } from "./lesson.entity";

@Entity()
export class SpellBook {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	name: string;

	@Column({ type: "text" })
	content: string;

	@OneToOne(() => Lesson, lesson => lesson.spellBook, { onDelete: "CASCADE" })
	@JoinColumn({ name: "lessonId" })
	Lesson: Lesson;

	@Column()
	lessonId: number;
}
