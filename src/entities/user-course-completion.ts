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
	user_id: string;

	@PrimaryColumn({ type: "int" })
	course_id: number;

	@CreateDateColumn()
	created_at: Date;

	@Column({ type: "text" })
	certificate_url: string;

	@ManyToOne(() => Course, course => course.userCourseCompletion, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "course_id" })
	courses: Course;

	@ManyToOne(() => User, user => user.userCourseCompletion, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "user_id" })
	users: User;
}
