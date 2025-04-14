import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Item } from "./item.entity";
import { User } from "./user.entity";

@Entity()
export class UserItem {
	@PrimaryColumn()
	userId: string;

	@PrimaryColumn()
	itemId: number;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@ManyToOne(() => Item, { onDelete: "CASCADE" })
	@JoinColumn({ name: "itemId" })
	item: Item;

	@Column({ type: "int", default: 0 })
	quantity: number;
}
