import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITEM_ERRORS } from "src/constants/errors";
import {
	ITEM_UNLOCK_CHATBOT_ID,
	ITEM_UNLOCK_SOLUTION_ID,
} from "src/constants/item";
import { RedisKey } from "src/constants/redis-key";
import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import {
	convertToMapData,
	parseToRedisData,
} from "src/utils/convert-redis.util";

import { RedisService } from "../cache/cache.service";

import { UpdateItemUnlockDto } from "./dto/update-item-unlock.dto";

@Injectable()
export class ItemUnlockService {
	constructor(
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		private redisService: RedisService,
	) {}

	async update(itemId: number, updateItemUnlock: UpdateItemUnlockDto) {
		if (
			itemId !== ITEM_UNLOCK_SOLUTION_ID &&
			itemId !== ITEM_UNLOCK_CHATBOT_ID
		) {
			throw new BadRequestException(ITEM_ERRORS.NOT_FOUND);
		}
		return await this.itemRepository.save({
			id: ITEM_UNLOCK_SOLUTION_ID,
			...updateItemUnlock,
		});
	}

	async use(userId: string, itemId: number, lessonId: number) {
		if (
			itemId !== ITEM_UNLOCK_SOLUTION_ID &&
			itemId !== ITEM_UNLOCK_CHATBOT_ID
		) {
			throw new BadRequestException(ITEM_ERRORS.NOT_FOUND);
		}
		const userLessonProgress = await this.userLessonProgressRepository.findOne({
			where: {
				userId: userId,
				lessonId: lessonId,
			},
		});
		if (userLessonProgress) {
			throw new BadRequestException(ITEM_ERRORS.ALREADY_FINISH);
		}

		const userItem = await this.userItemRepository.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
			relations: ["item"],
		});

		if (!userItem || userItem.quantity == 0) {
			throw new BadRequestException(ITEM_ERRORS.NOT_OWNED);
		}

		const rawData = await this.redisService.getMap(
			RedisKey.userItemUnlock(userId),
		);
		const data = convertToMapData(rawData);
		const key = itemId.toString();

		if (!data[key]) {
			data[key] = [];
		}

		if (data[key].includes(lessonId)) {
			throw new BadRequestException(ITEM_ERRORS.ALREADY_IN_USE);
		}

		data[key].push(lessonId);
		const redisData = parseToRedisData(data);
		this.redisService.setMap(RedisKey.userItemUnlock(userId), redisData, 0);

		this.userItemRepository.save({
			userId: userId,
			itemId: itemId,
			quantity: userItem.quantity - 1,
		});

		return {
			item: userItem.item.name,
			lessonId: lessonId,
		};
	}

	async check(userId: string, itemId: number, lessonId: number) {
		if (
			itemId !== ITEM_UNLOCK_SOLUTION_ID &&
			itemId !== ITEM_UNLOCK_CHATBOT_ID
		) {
			throw new BadRequestException(ITEM_ERRORS.NOT_FOUND);
		}
		const userItem = await this.userItemRepository.findOne({
			where: {
				userId: userId,
				itemId: itemId,
			},
		});
		const userLessonProgress = await this.userLessonProgressRepository.findOne({
			where: {
				userId: userId,
				lessonId: lessonId,
			},
		});
		if (userLessonProgress) {
			return true;
		}

		const rawData = await this.redisService.getMap(
			RedisKey.userItemUnlock(userId),
		);
		const data = convertToMapData(rawData);
		const key = itemId.toString();
		if (data[key]?.includes(lessonId)) {
			return true;
		}
		return {
			quantity: userItem?.quantity || 0,
		};
	}
}
