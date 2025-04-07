import { Exclude } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { ApiProperty } from "@nestjs/swagger";

import { IS_PUBLIC_KEY } from "src/decorators/public-route";

import { Chapter } from "./chapter.entity";
import { UserCourseCompletion } from "./user-course-completion";

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
	iconUrl: string;

	@Column({ type: "boolean", default: true })
	isPublic: boolean;

	@Column({ type: "boolean", default: false })
	isDeleted: boolean;

	@OneToMany(() => Chapter, chapter => chapter.course, { onDelete: "CASCADE" })
	chapters: Chapter[];

	@OneToMany(
		() => UserCourseCompletion,
		userCourseCompletion => userCourseCompletion.courses,
	)
	userCourseCompletion: UserCourseCompletion[];

	chaptersCount?: number;
	lessonsCount?: number;
	chaptersList?: { id: number; name: string }[];
}
