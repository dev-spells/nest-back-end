import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	name: string;

	@Column("text")
	description: string;

	@Column({ type: "jsonb" })
	stast: Record<string, any>;

	@Column({ type: "varchar" })
	imageUrl: string;
}
