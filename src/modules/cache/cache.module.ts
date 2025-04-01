import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { RedisService } from "./cache.service";

@Module({
	imports: [ConfigModule],
	providers: [
		RedisService,
		{
			provide: "REDIS_CLIENT",
			useFactory: (configService: ConfigService) => {
				const redisUrl = configService.get<string>("REDIS_URL");
				if (!redisUrl) {
					throw new Error("REDIS_URL is not defined in environment variables");
				}
				return new Redis(redisUrl);
			},
			inject: [ConfigService],
		},
	],
	exports: [RedisService],
})
export class RedisModule {}
