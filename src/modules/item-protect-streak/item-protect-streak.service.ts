import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";

import { ITEM_PROTECT_DAILY_STREAK_ID } from "src/constants/item";
import { RedisKey } from "src/constants/redis-key";
import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { RedisService } from "../cache/cache.service";

import { UpdateItemProtectStreakDto } from "./dto/update-item-protect-streak.dto";

@Injectable()
export class ItemProtectStreakService {
	constructor(
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(UserStreak)
		private userStreakRepository: Repository<UserStreak>,
		private redisService: RedisService,
	) {}

	async update(updateItemProtectStreakDto: UpdateItemProtectStreakDto) {
		return await this.itemRepository.save({
			id: ITEM_PROTECT_DAILY_STREAK_ID,
			...updateItemProtectStreakDto,
		});
	}

	async handleCron() {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const formatted = yesterday.toISOString().split("T")[0];

		// const today = new Date().toISOString().split("T")[0];

		const inactiveUsers = await this.userLessonProgressRepository
			.createQueryBuilder("userLessonProgress")
			.select("DISTINCT userLessonProgress.userId")
			.where(qb => {
				const subQuery = qb
					.subQuery()
					.select("DISTINCT ulp.userId")
					.from(UserLessonProgress, "ulp")
					.where(`DATE(ulp.createdAt) = :yesterday`, { yesterday: formatted })
					.getQuery();
				return `userLessonProgress.userId NOT IN ${subQuery}`;
			})
			.getRawMany();
		let inactiveUsersIds = inactiveUsers.map(user => user.userId);
		inactiveUsersIds = await this.checkUserInactivedFromRedis(inactiveUsersIds);
		console.log("redis filter", inactiveUsersIds);
		inactiveUsersIds = await this.checkUserProtectItem(inactiveUsersIds);
		console.log("database user item filter", inactiveUsersIds);

		const formatedInactiveUsersIds = inactiveUsersIds.map(user => {
			return {
				userId: user,
				curDailyStreak: 0,
			};
		});
		await this.userStreakRepository.save(formatedInactiveUsersIds);
	}

	private async checkUserInactivedFromRedis(users: string[]) {
		const redisUsers = await this.redisService.getKeys(
			RedisKey.userItemDailyStreak("*"),
		);
		console.log(redisUsers);
		const redisUserSet = new Set(redisUsers.map(user => user.split(":")[1]));

		return users.filter(user => !redisUserSet.has(user));
	}

	private async checkUserProtectItem(users: string[]) {
		const userItems = await this.userItemRepository.find({
			where: {
				userId: In(users),
				itemId: ITEM_PROTECT_DAILY_STREAK_ID,
				quantity: MoreThan(0),
			},
			select: {
				userId: true,
				item: {
					name: true,
					stats: {},
					imageUrl: true,
				},
				quantity: true,
			},
			relations: {
				item: true,
			},
		});

		if (userItems.length === 0) {
			return users;
		}

		await Promise.all(
			userItems.map(userItem =>
				this.redisService.set(
					RedisKey.userItemDailyStreak(userItem.userId),
					"true",
					userItem.item.stats.duration,
				),
			),
		);

		await this.userItemRepository
			.createQueryBuilder()
			.update()
			.set({ quantity: () => "quantity - 1" })
			.where("userId IN (:...userIds)", {
				userIds: userItems.map(item => item.userId),
			})
			.andWhere("itemId = :itemId", { itemId: ITEM_PROTECT_DAILY_STREAK_ID })
			.execute();

		// push notification to user later

		const userItemsSet = new Set(userItems.map(userItem => userItem.userId));
		return users.filter(user => !userItemsSet.has(user));
	}
}
