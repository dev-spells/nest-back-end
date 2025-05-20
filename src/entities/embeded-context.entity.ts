import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmbeddingContext {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	embedding: string;

	@Column({ type: "jsonb" })
	context: Record<string, string>;
}
