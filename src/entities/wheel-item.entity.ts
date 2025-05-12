import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { Item } from "./item.entity";

export enum WheelRewardType {
	ITEM = "ITEM",
	GEMS = "GEMS",
	XP = "XP",
}

@Entity()
export class WheelItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "enum", enum: WheelRewardType })
	rewardType: WheelRewardType;

	@ManyToOne(() => Item, { nullable: true })
	@JoinColumn({ name: "itemId" })
	item: Item;

	@Column({ type: "int", nullable: true })
	gems: number;

	@Column({ type: "int", nullable: true })
	xp: number;

	@Column({ default: 0 })
	probability: number;
}
