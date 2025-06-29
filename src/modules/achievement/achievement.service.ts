import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ACHIEVEMENTS } from "src/constants/achievement";
import { NOTIFY_TYPE } from "src/constants/notify-type";
import { UserAchievement } from "src/entities/user-achievement.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { NotificationService } from "../notification/notification.service";

@Injectable()
export class AchievementService {
	constructor(
		@InjectRepository(UserAchievement)
		private userAchievementRepository: Repository<UserAchievement>,
		@InjectRepository(UserStreak)
		private userStreakRepository: Repository<UserStreak>,
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		private notificationService: NotificationService,
	) {}

	async getAll(userId: string) {
		const userAchievements = await this.userAchievementRepository.find({
			select: {
				achievementType: true,
				achievementName: true,
			},
			where: { userId },
		});
		return userAchievements;
	}

	async getAchievementProgress(userId: string) {
		const userLessonCount = await this.userLessonProgressRepository.count({
			where: { userId },
		});
		const userStreak = await this.userStreakRepository.findOne({
			select: {
				maxDailyStreak: true,
				maxCorrectStreak: true,
				curDailyStreak: true,
				curCorrectStreak: true,
			},
			where: { userId },
		});
		const userAchievements = await this.userAchievementRepository.find({
			select: {
				id: true,
				userId: true,
				achievementType: true,
				achievementName: true,
			},
			where: { userId },
		});

		const progress: any = {};

		for (const [key, value] of Object.entries(ACHIEVEMENTS)) {
			let curMaxProgress = 0;
			let currentProgress = 0;
			if (key === "NUMBER_OF_LESSONS") {
				curMaxProgress = userLessonCount;
				currentProgress = userLessonCount;
			} else if (key === "DAILY_STREAK") {
				curMaxProgress = userStreak?.maxDailyStreak || 0;
				currentProgress = userStreak?.curDailyStreak || 0;
			} else if (key === "CORRECT_STREAK") {
				curMaxProgress = userStreak?.maxCorrectStreak || 0;
				currentProgress = userStreak?.curCorrectStreak || 0;
			}

			const userAchievement = userAchievements.find(
				ua => ua.achievementType === value.type,
			);

			let currentBadge = userAchievement?.achievementName || null;
			let nextBadge;
			let nextThreshold;

			const levels = value.levels;
			let found = false;
			for (let i = 0; i < levels.length; i++) {
				if (curMaxProgress < levels[i].threshold) {
					nextBadge = levels[i].name;
					nextThreshold = levels[i].threshold;
					found = true;
					break;
				}
			}
			if (!found && levels.length > 0) {
				nextBadge = null;
				nextThreshold = null;
			}
			if (!userAchievement) {
				currentBadge = null;
				if (levels.length > 0) {
					nextBadge = levels[0].name;
					nextThreshold = levels[0].threshold;
				}
			}

			// Use value.type as the key
			progress[value.type] = {
				currentBadge,
				currentProgress,
				nextBadge,
				nextThreshold,
			};
		}

		return progress;
	}

	async handleUserAchievement(userId: string) {
		const userAchievements = await this.userAchievementRepository.find({
			select: {
				id: true,
				userId: true,
				achievementType: true,
				achievementName: true,
			},
			where: { userId },
		});

		// Current achievement data
		const userDailyAchievement = userAchievements.find(
			ua => ua.achievementType === ACHIEVEMENTS.DAILY_STREAK.type,
		) || {
			userId: userId,
			achievementType: ACHIEVEMENTS.DAILY_STREAK.type,
			achievementName: "",
		};
		const userLessonAchievement = userAchievements.find(
			ua => ua.achievementType === ACHIEVEMENTS.NUMBER_OF_LESSONS.type,
		) || {
			userId: userId,
			achievementType: ACHIEVEMENTS.NUMBER_OF_LESSONS.type,
			achievementName: "",
		};
		const userCorrectAchivement = userAchievements.find(
			ua => ua.achievementType === ACHIEVEMENTS.CORRECT_STREAK.type,
		) || {
			userId: userId,
			achievementType: ACHIEVEMENTS.CORRECT_STREAK.type,
			achievementName: "",
		};
		// Calculate for achievement levels
		this.handleUserStreakAchievement(
			userId,
			userDailyAchievement,
			userCorrectAchivement,
		);
		this.handleUserLessonAchievement(userId, userLessonAchievement);
	}
	private async handleUserStreakAchievement(
		userID: string,
		userDailyAchievement: {
			id?: number;
			userId: string;
			achievementType: string;
			achievementName: string;
		},
		userCorrectAchievement: {
			id?: number;
			userId: string;
			achievementType: string;
			achievementName: string;
		},
	) {
		const userStreak = await this.userStreakRepository.findOne({
			select: {
				maxDailyStreak: true,
				maxCorrectStreak: true,
			},
			where: { userId: userID },
		});
		const dailyStreakLevels = ACHIEVEMENTS.DAILY_STREAK.levels;
		const correctStreakLevels = ACHIEVEMENTS.CORRECT_STREAK.levels;

		let changeDailyStreakFlag = false;
		let changeCorrectStreakFlag = false;
		if (userStreak?.maxDailyStreak) {
			for (let i = dailyStreakLevels.length - 1; i >= 0; i--) {
				if (userStreak.maxDailyStreak >= dailyStreakLevels[i].threshold) {
					if (
						userDailyAchievement.achievementName !== dailyStreakLevels[i].name
					) {
						userDailyAchievement.achievementName = dailyStreakLevels[i].name;
						changeDailyStreakFlag = true;
						break;
					} else {
						break;
					}
				}
			}
		}
		if (userStreak?.maxCorrectStreak) {
			for (let i = correctStreakLevels.length - 1; i >= 0; i--) {
				if (userStreak.maxCorrectStreak >= correctStreakLevels[i].threshold) {
					if (
						userCorrectAchievement.achievementName !==
						correctStreakLevels[i].name
					) {
						userCorrectAchievement.achievementName =
							correctStreakLevels[i].name;
						changeCorrectStreakFlag = true;
						break;
					} else {
						break;
					}
				}
			}
		}
		if (changeDailyStreakFlag) {
			await this.userAchievementRepository.save(userDailyAchievement);
			this.notificationService.pushToUser(userDailyAchievement.userId, {
				type: NOTIFY_TYPE.DAILY_STREAK.type,
				message: NOTIFY_TYPE.DAILY_STREAK.message,
			});
		}
		if (changeCorrectStreakFlag) {
			await this.userAchievementRepository.save(userCorrectAchievement);
			this.notificationService.pushToUser(userCorrectAchievement.userId, {
				type: NOTIFY_TYPE.CORRECT_STREAK.type,
				message: NOTIFY_TYPE.CORRECT_STREAK.message,
			});
		}
	}
	private async handleUserLessonAchievement(
		userId: string,
		userLessonAchievement: {
			id?: number;
			userId: string;
			achievementType: string;
			achievementName: string;
		},
	) {
		const countUserLesson = await this.userLessonProgressRepository.count({
			where: { userId },
		});
		const lessonCountLevels = ACHIEVEMENTS.NUMBER_OF_LESSONS.levels;

		let changeLessonCountFlag = false;

		if (countUserLesson) {
			for (let i = lessonCountLevels.length - 1; i >= 0; i--) {
				if (countUserLesson >= lessonCountLevels[i].threshold) {
					if (
						userLessonAchievement.achievementName !== lessonCountLevels[i].name
					) {
						userLessonAchievement.achievementName = lessonCountLevels[i].name;
						changeLessonCountFlag = true;
						break;
					} else {
						break;
					}
				}
			}
		}
		if (changeLessonCountFlag) {
			await this.userAchievementRepository.save(userLessonAchievement);
			this.notificationService.pushToUser(userLessonAchievement.userId, {
				type: NOTIFY_TYPE.LESSON_ACHIEVEMENT.type,
				message: NOTIFY_TYPE.LESSON_ACHIEVEMENT.message,
			});
		}
	}
}
