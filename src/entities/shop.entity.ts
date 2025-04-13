import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { Item } from "./item.entity";

@Entity()
export class Shop {
	@PrimaryColumn()
	itemId: number;

	@OneToOne(() => Item, { onDelete: "CASCADE" })
	@JoinColumn({ name: "itemId" })
	item: Item;

	@Column({ type: "int" })
	sellPrices: number;

	@Column({ type: "int" })
	buyPrices: number;
}
