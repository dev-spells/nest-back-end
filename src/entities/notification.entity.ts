import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Course } from "./course.entity";
import { Item } from "./item.entity";
import { User } from "./user.entity";

@Entity()
export class Notification {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: string;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	type: string;

	@Column({ type: "text" })
	message: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ default: false })
	isRead: boolean;

	@Column({ nullable: true })
	itemId: number | null;

	@ManyToOne(() => Item, { onDelete: "CASCADE" })
	@JoinColumn({ name: "itemId" })
	item: Item | null;

	@Column({ nullable: true })
	courseId: number | null;

	@ManyToOne(() => Course, { onDelete: "CASCADE" })
	@JoinColumn({ name: "courseId" })
	course: Course | null;
}
