import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class UserStreak {
	@PrimaryColumn()
	userId: string;

	@OneToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@Column({ type: "int", default: 0 })
	curDailyStreak: number;

	@Column({ type: "int", default: 0 })
	maxDailyStreak: number;

	@Column({ type: "int", default: 0 })
	currentCorrectStreak: number;

	@Column({ type: "int", default: 0 })
	maxCorrectStreak: number;
}
