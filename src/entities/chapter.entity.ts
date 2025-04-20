import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { Course } from "./course.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class Chapter {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	name: string;

	@Column({ type: "float", nullable: true })
	pos: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Course, course => course.chapters, { onDelete: "CASCADE" })
	course: Course;

	@OneToMany(() => Lesson, lesson => lesson.chapter)
	lessons: Lesson[];
}
