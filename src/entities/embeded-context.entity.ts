import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmbeddingContext {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	embedding: string;

	@Column({ type: "jsonb" })
	context: Record<string, string>;
}
