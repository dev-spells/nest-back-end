import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { UserCourseCompletion } from "./user-course-completion";

export enum UserRole {
	USER = "user",
	ADMIN = "admin",
}

@Entity("user")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", unique: true })
	username: string;

	@Exclude()
	@Column({ type: "text" })
	password: string;

	@Column({ type: "varchar", unique: true })
	email: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	avatarUrl: string;

	@Column({ type: "int", default: 1 })
	level: number;

	@Exclude()
	@Column({ type: "enum", enum: UserRole })
	role: UserRole;

	@Column({ type: "bigint", default: 0 })
	currentExp: number;

	@Column({ type: "varchar", length: 255 })
	rankTitle: string;

	@Column({ type: "bigint", default: 0 })
	gems: number;

	@Column({ type: "varchar", length: 255, default: "UTC" })
	timezone: string;

	@Column({ type: "text", nullable: true })
	githubAccessToken: string;

	@OneToMany(
		() => UserCourseCompletion,
		userCourseCompletion => userCourseCompletion.users,
	)
	userCourseCompletion: UserCourseCompletion[];
	@Column({ default: false })
	isActived: boolean;
}
