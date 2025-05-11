import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";

import { ITEM_ERRORS } from "src/constants/errors";
import { ITEM_PROTECT_DAILY_STREAK_ID } from "src/constants/item";
import { NOTIFY_TYPE } from "src/constants/notify-type";
import { RedisKey } from "src/constants/redis-key";
import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { RedisService } from "../cache/cache.service";

import { NotificationService } from "./../notification/notification.service";
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
		private notificationService: NotificationService,
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
			.innerJoin(
				UserStreak,
				"userStreak",
				"userStreak.userId = userLessonProgress.userId AND userStreak.curDailyStreak > 0",
			)

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
		return await this.userItemRepository.manager.transaction(async manager => {
			const repo = manager.getRepository(UserItem);
			const item = await this.itemRepository.findOne({
				where: { id: ITEM_PROTECT_DAILY_STREAK_ID },
				select: {
					stats: {},
				},
			});
			if (!item) {
				throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
			}
			const userItems = await repo.find({
				where: {
					userId: In(users),
					itemId: ITEM_PROTECT_DAILY_STREAK_ID,
					quantity: MoreThan(0),
				},
				select: {
					userId: true,
					quantity: true,
				},
				lock: { mode: "pessimistic_write" },
			});

			if (userItems.length === 0) {
				return users;
			}

			await Promise.all(
				userItems.map(userItem =>
					this.redisService.set(
						RedisKey.userItemDailyStreak(userItem.userId),
						"true",
						item.stats.duration,
					),
				),
			);

			await repo
				.createQueryBuilder()
				.update()
				.set({ quantity: () => "quantity - 1" })
				.where("userId IN (:...userIds)", {
					userIds: userItems.map(item => item.userId),
				})
				.andWhere("itemId = :itemId", { itemId: ITEM_PROTECT_DAILY_STREAK_ID })
				.execute();

			await this.notificationService.pushToUsers(
				userItems.map(userItem => userItem.userId),
				{
					...NOTIFY_TYPE.USE_PROTECT_DAILY_STREAK,
					itemId: ITEM_PROTECT_DAILY_STREAK_ID,
				},
			);
			const userItemsSet = new Set(userItems.map(userItem => userItem.userId));
			return users.filter(user => !userItemsSet.has(user));
		});
	}
}
