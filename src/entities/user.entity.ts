import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { LEVELS } from "src/constants/level";

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

	@Column({ type: "varchar", length: 255, nullable: true })
	borderUrl: string;

	@Column({ type: "int", default: 1 })
	level: number;

	@Exclude()
	@Column({ type: "enum", enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Column({ type: "int", default: 0 })
	currentExp: number;

	@Column({ type: "int", default: LEVELS[0].expToLevelUp })
	expToLevelUp: number;

	@Column({ type: "varchar", length: 255 })
	rankTitle: string;

	@Column({ type: "int", default: 0 })
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
