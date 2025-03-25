import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
	constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

	async get<T>(key: string): Promise<T | null> {
		const jsonValue = await this.redisClient.get(key);
		if (!jsonValue) return null;
		return JSON.parse(jsonValue) as T;
	}

	async set<T>(key: string, value: T, expiration?: number): Promise<void> {
		const jsonValue = JSON.stringify(value);
		if (expiration) {
			await this.redisClient.set(key, jsonValue, "EX", expiration);
		} else {
			await this.redisClient.set(key, jsonValue);
		}
	}

	async del(key: string): Promise<void> {
		await this.redisClient.del(key);
	}

	async setMap(
		key: string,
		map: Record<string, string | number>,
		expiration?: number,
	): Promise<void> {
		await this.redisClient.hmset(key, map);
		if (expiration) {
			await this.redisClient.expire(key, expiration); // Set expiration in seconds
		}
	}

	async getMap(key: string): Promise<Record<string, string>> {
		return this.redisClient.hgetall(key);
	}

	async getMapField(key: string, field: string): Promise<string | null> {
		return this.redisClient.hget(key, field);
	}

	async setMapField(
		key: string,
		field: string,
		value: string | number,
	): Promise<void> {
		await this.redisClient.hset(key, field, value);
	}

	async delMapField(key: string, field: string): Promise<void> {
		await this.redisClient.hdel(key, field);
	}
}
