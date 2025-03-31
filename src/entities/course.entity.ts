import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { UserCourseCompletion } from "./user-course-completion";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Chapter } from "./chapter.entity";

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	title: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column({ type: "text" })
	description: string;

	@Column({ type: "text", nullable: true })
	icon_url: string;

	@Column({ type: "boolean" })
	is_public: boolean;

	@OneToMany(() => Chapter, chapter => chapter.course, { onDelete: "CASCADE" })
	chapters: Chapter[];

	@OneToMany(
		() => UserCourseCompletion,
		userCourseCompletion => userCourseCompletion.courses,
	)
	userCourseCompletion: UserCourseCompletion[];
}
