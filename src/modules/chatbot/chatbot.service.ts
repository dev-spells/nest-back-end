import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai";
import * as pgvector from "pgvector";
import { DataSource } from "typeorm";

import { EmbeddingContext } from "src/entities/embeded-context.entity";

@Injectable()
export class ChatbotService implements OnModuleInit {
	private readonly ai: GoogleGenAI;
	private dataSource: DataSource;

	constructor(private readonly configService: ConfigService) {
		this.ai = new GoogleGenAI({
			apiKey: configService.get("GEMINI_API_KEY"),
		});
	}

	async onModuleInit() {
		this.dataSource = new DataSource({
			type: "postgres",
			url: this.configService.get("DATABASE_URL"),
			entities: [EmbeddingContext],
			synchronize: false,
		});
		await this.dataSource.initialize();
	}

	async embedContent(body: { question: string; answer: string; type: string }) {
		const response = await this.ai.models.embedContent({
			model: "text-embedding-004",
			contents: [
				{
					parts: [{ text: body.question }, { text: body.type }],
				},
			],
			config: {
				outputDimensionality: 512,
			},
		});
		if (response.embeddings?.[0]?.values) {
			console.log(response.embeddings);
			return await this.dataSource.getRepository(EmbeddingContext).save({
				embedding: pgvector.toSql(response.embeddings[0].values),
				context: { ...body },
			});
		}
	}

	async findSimilarContext(text: string) {
		const response = await this.ai.models.embedContent({
			model: "text-embedding-004",
			contents: [
				{
					parts: [{ text }],
				},
			],
			config: {
				outputDimensionality: 512,
			},
		});
		if (response.embeddings?.[0]?.values) {
			const items = await this.dataSource
				.getRepository(EmbeddingContext)
				.createQueryBuilder("embeddingContext")
				.where("embedding <-> :embedding < :threshold")
				.orderBy("embedding <-> :embedding")
				.setParameters({
					embedding: pgvector.toSql(response.embeddings[0].values),
					threshold: 0.7,
				})
				.limit(5)
				.getMany();

			return items.map(item => item.context);
		}
	}
}
