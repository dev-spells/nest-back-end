import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThanOrEqual, Repository } from "typeorm";

import { ITEM_ERRORS, USER_ERRORS, WHEEL_ERRORS } from "src/constants/errors";
import { NOTIFY_TYPE } from "src/constants/notify-type";
import { RedisKey } from "src/constants/redis-key";
import { REWARD_WHEEL_THRESHOLD } from "src/constants/reward-wheel";
import { Item } from "src/entities/item.entity";
import { Notification } from "src/entities/notification.entity";
import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";
import { WheelItem, WheelRewardType } from "src/entities/wheel-item.entity";
import { calculateLevel } from "src/utils/levels.util";

import { NotificationService } from "../notification/notification.service";

import { RedisService } from "./../cache/cache.service";
import {
	CreateRewardWheelDto,
	HandleRewardDto,
} from "./dto/create-reward-wheel.dto";
import {
	UpdateProbabilityDto,
	UpdateRewardWheelDto,
} from "./dto/update-reward-wheel.dto";

@Injectable()
export class RewardWheelService {
	constructor(
		@InjectRepository(WheelItem)
		private wheelItemRepository: Repository<WheelItem>,
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
		private redisService: RedisService,
		private notificationService: NotificationService,
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
	) {}

	async handleCron() {
		await this.userRepository
			.createQueryBuilder()
			.update()
			.set({ totalExpGainedToday: 0 })
			.where("totalExpGainedToday != 0")
			.execute();
		this.redisService.del(RedisKey.wheel);
	}

	async checkUserCanSpin(userId: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		let canSpin = user.totalExpGainedToday >= REWARD_WHEEL_THRESHOLD;
		const wheelUsers: string | null = await this.redisService.get(
			RedisKey.wheel,
		);
		if (wheelUsers) {
			const wheelUsersArray = JSON.parse(wheelUsers);
			if (wheelUsersArray.includes(userId)) {
				canSpin = false;
			}
		}
		if (canSpin) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const existingNotification = await this.notificationRepository.findOne({
				where: {
					userId: userId,
					type: NOTIFY_TYPE.UNLOCK_WHEEL.type,
					createdAt: MoreThanOrEqual(today),
				},
			});

			// if (!existingNotification) {
			this.notificationService.pushToUser(userId, {
				type: NOTIFY_TYPE.UNLOCK_WHEEL.type,
				message: NOTIFY_TYPE.UNLOCK_WHEEL.message,
			});
			// }
		}
		return {
			canSpin,
			totalExpGainedToday: user.totalExpGainedToday,
			wheelThreshold: REWARD_WHEEL_THRESHOLD,
		};
	}

	async updateBatchProbability(updateProbabilityDto: UpdateProbabilityDto[]) {
		const wheelItems = await this.wheelItemRepository.find({
			where: {
				id: In(updateProbabilityDto.map(wheelItem => wheelItem.id)),
			},
		});
		if (wheelItems.length !== updateProbabilityDto.length) {
			throw new NotFoundException("Some item not found");
		}
		return await this.wheelItemRepository.save(updateProbabilityDto);
	}

	async getWheel() {
		const wheelItems = await this.wheelItemRepository.find({
			relations: {
				item: true,
			},
			order: {
				id: "ASC",
			},
		});
		return wheelItems.map(wheelItem => ({
			id: wheelItem.id,
			rewardType: wheelItem.rewardType,
			item: wheelItem.item,
			gems: wheelItem.gems,
			xp: wheelItem.xp,
			probability: wheelItem.probability,
		}));
	}

	async update(updateRewardWheelDto: UpdateRewardWheelDto) {
		const wheelItem = await this.wheelItemRepository.findOne({
			where: { id: updateRewardWheelDto.id },
		});
		if (!wheelItem) {
			throw new NotFoundException(WHEEL_ERRORS.NOT_FOUND);
		}

		try {
			return await this.wheelItemRepository.save({
				...updateRewardWheelDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async create(createRewardWheelDto: CreateRewardWheelDto) {
		if (
			createRewardWheelDto.itemId &&
			!(await this.itemRepository.exists({
				where: { id: createRewardWheelDto.itemId },
			}))
		) {
			throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
		}

		const wheelItem = await this.wheelItemRepository.findOne({
			where: {
				rewardType: createRewardWheelDto.rewardType,
				item: {
					id: createRewardWheelDto.itemId,
				},
				gems: createRewardWheelDto.gems,
				xp: createRewardWheelDto.xp,
				probability: createRewardWheelDto.probability,
			},
		});

		if (wheelItem) {
			throw new BadRequestException(WHEEL_ERRORS.ITEM_ALREADY_EXISTS);
		}

		try {
			return await this.wheelItemRepository.save({
				...createRewardWheelDto,
				item: {
					id: createRewardWheelDto.itemId,
				},
			});
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async delete(wheelItemId: number) {
		const wheelItem = await this.wheelItemRepository.findOne({
			where: { id: wheelItemId },
		});
		if (!wheelItem) {
			throw new NotFoundException(WHEEL_ERRORS.NOT_FOUND);
		}
		return await this.wheelItemRepository.delete(wheelItemId);
	}

	async handleReward(userId: string, handleRewardDto: HandleRewardDto) {
		let userList: string[] = [];

		const wheelItem = await this.wheelItemRepository.findOne({
			where: {
				id: handleRewardDto.wheelItemId,
			},
			relations: {
				item: true,
			},
		});
		if (!wheelItem) {
			throw new NotFoundException(WHEEL_ERRORS.NOT_FOUND);
		}

		// update to redis
		const wheelUsers: string | null = await this.redisService.get(
			RedisKey.wheel,
		);
		if (wheelUsers) {
			try {
				userList = JSON.parse(wheelUsers);
			} catch {
				userList = [];
			}
		}

		if (!userList.includes(userId)) {
			userList.push(userId);
			this.redisService.set(RedisKey.wheel, JSON.stringify(userList), 0);
		}

		const user = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}

		switch (wheelItem.rewardType) {
			case WheelRewardType.GEMS: {
				user.gems += wheelItem.gems;
				await this.userRepository.save(user);
				return {
					user: null,
					rewardType: wheelItem.rewardType,
					gems: wheelItem.gems,
					xp: wheelItem.xp,
					item: wheelItem.item,
					canSpin: false,
				};
			}
			case WheelRewardType.XP: {
				const userStats = calculateLevel(
					user.currentExp,
					user.level,
					wheelItem.xp,
				);
				await this.userRepository.update(userId, {
					currentExp: userStats.curExp,
					level: userStats.curLevel,
					expToLevelUp: userStats.expToLevelUp,
					borderUrl: userStats.rankBorder,
					rankTitle: userStats.rankTitle,
				});
				return {
					user: {
						levelUp: userStats.levelUp,
						gems: user.gems,
						currentExp: userStats.curExp,
						level: userStats.curLevel,
						expToLevelUp: userStats.expToLevelUp,
						borderUrl: userStats.rankBorder,
						rankTitle: userStats.rankTitle,
					},
					rewardType: wheelItem.rewardType,
					gems: wheelItem.gems,
					xp: wheelItem.xp,
					item: wheelItem.item,
					canSpin: false,
				};
			}
			case WheelRewardType.ITEM: {
				const userItem = await this.userItemRepository.findOne({
					where: {
						userId: userId,
						itemId: wheelItem.item.id,
					},
				});
				if (!userItem) {
					await this.userItemRepository.save({
						userId: userId,
						itemId: wheelItem.item.id,
						quantity: 1,
					});
				} else {
					userItem.quantity += 1;
					await this.userItemRepository.save(userItem);
				}

				return {
					user: null,
					rewardType: wheelItem.rewardType,
					gems: wheelItem.gems,
					xp: wheelItem.xp,
					item: wheelItem.item,
					canSpin: false,
				};
			}
			default:
				throw new BadRequestException(WHEEL_ERRORS.INVALID_REWARD_TYPE);
		}
	}
}
