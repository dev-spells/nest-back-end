import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { User } from "./user.entity";

@Entity()
export class UserAchievement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: string;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	achievementType: string;

	@Column()
	achievementName: string;

	@UpdateDateColumn()
	updatedAt: Date;
}
