import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITEM_ERRORS } from "src/constants/errors";
import { ITEM_XP_ID } from "src/constants/item";
import { RedisKey } from "src/constants/redis-key";
import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";

import { RedisService } from "./../cache/cache.service";
import { UpdateItemXPDto } from "./dto/update-item-xp.dto";

@Injectable()
export class ItemXpService {
	constructor(
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
		private RedisService: RedisService,
	) {}

	async get() {
		const itemXP = await this.itemRepository.findOne({
			where: {
				id: ITEM_XP_ID,
			},
		});
		if (!itemXP) {
			throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
		}
		return itemXP;
	}

	async update(updateItemXPDto: UpdateItemXPDto) {
		return await this.itemRepository.save({
			id: ITEM_XP_ID,
			...updateItemXPDto,
		});
	}

	async use(userId: string) {
		const userItem = await this.userItemRepository.findOne({
			where: {
				userId: userId,
				itemId: ITEM_XP_ID,
			},
			relations: ["item"],
		});
		if (!userItem || userItem.quantity == 0) {
			throw new NotFoundException(ITEM_ERRORS.NOT_OWNED);
		}
		const redisItemXP = await this.RedisService.getMap(
			RedisKey.userItemXP(userId),
		);
		if (Object.keys(redisItemXP).length > 0) {
			throw new BadRequestException(ITEM_ERRORS.ALREADY_IN_USE);
		}
		const timestamp = Date.now();
		await this.RedisService.setMap(
			RedisKey.userItemXP(userId),
			{
				item: userItem.item.name,
				timestamp: timestamp,
				bonus: userItem.item.stats.bonus,
				duration: userItem.item.stats.duration,
			},
			userItem.item.stats.duration * 60,
		);
		this.userItemRepository.save({
			...userItem,
			quantity: userItem.quantity - 1,
		});
		return {
			item: userItem.item.name,
			startedAt: timestamp,
			bonus: userItem.item.stats.bonus,
			duration: userItem.item.stats.duration,
		};
	}

	async check(userId: string) {
		const itemInUsed = await this.RedisService.getMap(
			RedisKey.userItemXP(userId),
		);
		if (Object.keys(itemInUsed).length > 0) {
			return {
				...itemInUsed,
			};
		} else {
			return null;
		}
	}
}
