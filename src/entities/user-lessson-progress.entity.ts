import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";

import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";

@Entity()
export class UserLessonProgress {
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@PrimaryColumn({ type: "int" })
	lessonId: number;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Lesson, { onDelete: "CASCADE" })
	@JoinColumn({ name: "lessonId" })
	lesson: Lesson;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;
}
