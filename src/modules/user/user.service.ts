import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { In, MoreThan, Repository } from "typeorm";

import { USER_ERRORS } from "src/constants/errors";
import { LEVELS, RANKS } from "src/constants/level";
import { RedisKey } from "src/constants/redis-key";
import { UserAchievement } from "src/entities/user-achievement.entity";
import { UserCourseCompletion } from "src/entities/user-course-completion";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";
import { localDate } from "src/utils/convert-time.util";
import { hashPassword } from "src/utils/handle-password.util";
import { sanitizeGithubUsername } from "src/utils/sanitize-github-username.util";

import { User, UserRole } from "../../entities/user.entity";
import { RedisService } from "../cache/cache.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import Redis from "ioredis";
// import aqp from 'api-query-params';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(UserStreak)
		private userStreakRepository: Repository<UserStreak>,
		@InjectRepository(UserAchievement)
		private userAchievementRepository: Repository<UserAchievement>,
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(UserCourseCompletion)
		private userCourseCompletionRepository: Repository<UserCourseCompletion>,
		private redisService: RedisService,
	) {}

	async get(userId: string) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				level: true,
				currentExp: true,
				expToLevelUp: true,
				rankTitle: true,
				gems: true,
				avatarUrl: true,
			},
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		user.username = sanitizeGithubUsername(user.username);
		const userStreak = await this.userStreakRepository.findOne({
			where: { userId: userId },
			select: {
				curCorrectStreak: true,
				curDailyStreak: true,
			},
		});
		return { user, userStreak };
	}

	async getUserStreak(userId: string) {
		const userStreak = await this.userStreakRepository.find({
			where: { userId: userId },
			select: {
				curCorrectStreak: true,
				curDailyStreak: true,
			},
		});
		return userStreak;
	}

	async getUserCourseCompleted(userCourseCompletedId: string) {
		const userCourseCompleted =
			await this.userCourseCompletionRepository.findOne({
				select: {
					id: true,
					createdAt: true,
					courses: {
						id: true,
						title: true,
						createdAt: true,
						iconUrl: true,
					},
					users: {
						id: true,
						username: true,
					},
				},
				where: { id: userCourseCompletedId },
				relations: {
					courses: true,
					users: true,
				},
			});
		if (!userCourseCompleted) {
			throw new NotFoundException(USER_ERRORS.USER_COURSE_COMPLETED_NOT_FOUND);
		}
		return userCourseCompleted;
	}

	async getDetail(userId: string, profileId: string) {
		const user = await this.userRepository.findOne({
			where: { id: profileId },
			select: {
				id: true,
				username: true,
				joinedAt: true,
				email: true,
				level: true,
				currentExp: true,
				rankTitle: true,
				gems: true,
				avatarUrl: true,
				description: true,
				githubAccessToken: true,
			},
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		user.username = sanitizeGithubUsername(user.username);
		user.joinedAt = localDate(user.joinedAt);
		let githubContribute;
		if (user.githubAccessToken) {
			githubContribute = await this.getGithubContributions(
				profileId,
				user.githubAccessToken,
			);
		}

		const higherCount = await this.userRepository.count({
			where: {
				level: MoreThan(user.level),
			},
		});
		const userRank = higherCount + 1;

		const userLessonProgress = await this.userLessonProgressRepository
			.createQueryBuilder("progress")
			.select("DATE(progress.createdAt)", "date")
			.addSelect("COUNT(*)", "count")
			.where("progress.userId = :userId", { userId: profileId })
			.groupBy("DATE(progress.createdAt)")
			.orderBy("DATE(progress.createdAt)", "ASC")
			.getRawMany();
		const totalLessonFinished = String(
			userLessonProgress.reduce((acc, row) => {
				return acc + parseInt(row.count, 10);
			}, 0),
		);
		const formatedUserLessonProgress = userLessonProgress.map(row => ({
			date: localDate(row.date).toISOString().split("T")[0],
			count: parseInt(row.count, 10),
		}));
		const combinedProgressData = githubContribute
			? githubContribute.map(github => {
					const lesson = formatedUserLessonProgress.find(
						lesson => lesson.date === github.date,
					);

					return {
						date: github.date,
						count: github.count + (lesson ? lesson.count : 0), // Add counts together
					};
				})
			: formatedUserLessonProgress;

		// const maxCount = Math.max(...combinedProgressData.map(d => d.count));
		const normalizeLevel = (count: number) => {
			if (count === 0) return 0;
			if (count >= 10) return 3;
			if (count >= 5) return 2;
			if (count >= 1) return 1;
			return 4;
		};

		// Transform data for react-activity-calendar
		const calendarData = combinedProgressData.map(({ date, count }) => ({
			date,
			count,
			level: normalizeLevel(count),
		}));
		const userAchievement = await this.userAchievementRepository.find({
			where: { userId: profileId },
		});
		if (userAchievement) {
			userAchievement.forEach(row => {
				row.updatedAt = localDate(row.updatedAt);
			});
		}
		const userCourseCompleted = await this.userCourseCompletionRepository.find({
			where: { userId: profileId },
			relations: {
				courses: true,
			},
		});
		if (userCourseCompleted) {
			userCourseCompleted.map(row => {
				row.createdAt = localDate(row.createdAt);
			});
		}

		return {
			isOwner: userId === profileId ? true : false,
			user: {
				id: user.id,
				username: user.username,
				joinedAt: user.joinedAt,
				email: user.email,
				level: user.level,
				currentExp: user.currentExp,
				rankTitle: user.rankTitle,
				gems: user.gems,
				avatarUrl: user.avatarUrl,
				description: user.description,
			},
			userRank: userRank,
			totalLesson: totalLessonFinished,
			userCourseCompleted,
			userAchievement,
			userLessonProgress: calendarData,
		};
	}

	private async getGithubContributions(
		userId: string,
		githubAccessToken: string,
	) {
		const cachedData = await this.redisService.get(
			RedisKey.userGithubProgress(userId),
		);
		if (cachedData) {
			return cachedData;
		}

		const now = new Date().toISOString();
		const sixMonthsAgo = new Date(
			new Date().setMonth(new Date().getMonth() - 6) - 13 * 86400000,
		);
		sixMonthsAgo.setUTCHours(0, 0, 0, 0);
		const response = await axios.post(
			"https://api.github.com/graphql",
			{
				query: `
			  query {
				viewer {
					contributionsCollection(from: "${sixMonthsAgo.toISOString()}", to: "${now}") {
					contributionCalendar {
						weeks {
						contributionDays {
							date
							contributionCount
						}
						}
					}
					}
				}
				}
			`,
			},
			{
				headers: {
					Authorization: `Bearer ${githubAccessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		const weeks =
			response.data.data.viewer.contributionsCollection.contributionCalendar
				.weeks;
		const days = weeks.flatMap(week => week.contributionDays);

		const formatedData = days.map(day => ({
			date: day.date,
			count: day.contributionCount,
		}));
		console.log(formatedData);
		this.redisService.set(
			RedisKey.userGithubProgress(userId),
			formatedData,
			60 * 60 * 2,
		);

		return formatedData;
	}

	async createUser(dto: CreateUserDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: dto.email },
		});
		if (existingUser) {
			throw new BadRequestException(USER_ERRORS.EMAIL_IN_USE);
		}

		const hashedPassword = await hashPassword(dto.password);
		const user = await this.userRepository.save({
			...dto,
			password: hashedPassword,
			level: 1,
			currentExp: 0,
			rankTitle: "Bronze",
			gems: 0,
			timezone: "UTC",
			role: UserRole.USER,
		});
		this.userStreakRepository.save({
			userId: user.id,
		});

		return user;
	}

	async updatePassword(id: string, newPassword: string) {
		const hashedPassword = await hashPassword(newPassword);
		await this.userRepository.update(id, { password: hashedPassword });
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { username } = updateUserDto;
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		if (username && (await this.isUsernameExists(username))) {
			throw new BadRequestException(USER_ERRORS.USERNAME_IN_USE);
		}
		await this.userRepository.update(id, updateUserDto);
	}

	async findByUsername(username: string) {
		const existingUser = await this.userRepository.findOne({
			where: { username },
		});
		return existingUser;
	}

	async findByEmail(email: string) {
		const existingUser = await this.userRepository.findOne({
			where: { email },
		});
		return existingUser;
	}

	async isEmailExists(email: string) {
		const existingUser = await this.userRepository.exists({
			where: { email },
		});
		return existingUser;
	}

	async isUsernameExists(username: string) {
		const existingUser = await this.userRepository.exists({
			where: { username },
		});
		return existingUser;
	}

	async findById(id: string) {
		const existingUser = await this.userRepository.findOne({
			where: { id: id },
		});
		return existingUser;
	}
	async prepareDemoUser() {
		const userId = "ed1fec91-a425-4083-aa58-03ecc1b3419c";
		const lessonIds = [257, 258, 259, 260];
		const twoDaysAgo = new Date();
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
		const twoDaysAgoLesson = 254;

		await this.userRepository.update(userId, {
			level: 10,
			rankTitle: RANKS[0].name,
			borderUrl: RANKS[0].border,
			expToLevelUp: LEVELS[9].expToLevelUp,
			currentExp: 2200,
			totalExpGainedToday: 2300,
		});
		await this.userLessonProgressRepository.delete({
			userId: userId,
			lessonId: In(lessonIds),
		});
		await this.userLessonProgressRepository.save({
			userId: userId,
			lessonId: twoDaysAgoLesson,
			createdAt: twoDaysAgo,
		});
		await this.userStreakRepository.update(userId, {
			curDailyStreak: 1,
		});
		await this.redisService.del(RedisKey.userItemDailyStreak(userId));
		await this.redisService.del(RedisKey.userItemXP(userId));
		await this.redisService.del(RedisKey.wheel);
	}
}
