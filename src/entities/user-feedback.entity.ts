import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";

export enum FeedbackType {
	LESSON_BUG = "LESSON_BUG",
	EXERCISE_BUG = "EXERCISE_BUG",
	SPELLBOOK_BUG = "SPELLBOOK_BUG",
	FEATURE_REQUEST = "FEATURE_REQUEST",
	OTHER = "OTHER",
}

export enum FeedbackStatus {
	OPEN = "OPEN",
	RESOLVED = "RESOLVED",
}

@Entity()
export class UserFeedback {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })
	feedback: string;

	@Column({ type: "enum", enum: FeedbackType })
	feedbackType: FeedbackType;

	@Column({ type: "enum", enum: FeedbackStatus, default: FeedbackStatus.OPEN })
	status: FeedbackStatus;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
	user: User;

	@ManyToOne(() => Lesson, { onDelete: "CASCADE", nullable: false })
	lesson: Lesson;
}
