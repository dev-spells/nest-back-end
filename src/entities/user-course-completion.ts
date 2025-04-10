import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";

import { Course } from "./course.entity";
import { User } from "./user.entity";

@Entity()
export class UserCourseCompletion {
	@PrimaryColumn({ type: "uuid" })
	userId: string;

	@PrimaryColumn({ type: "int" })
	courseId: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ type: "text" })
	certificateUrl: string;

	@ManyToOne(() => Course, course => course.userCourseCompletion, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "courseId" })
	courses: Course;

	@ManyToOne(() => User, user => user.userCourseCompletion, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "userId" })
	users: User;
}
