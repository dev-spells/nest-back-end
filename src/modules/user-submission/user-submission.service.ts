import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
	COURSE_ERRORS,
	EXERCISE_ERRORS,
	LESSON_ERRORS,
	USER_ERRORS,
} from "src/constants/errors";
import { EXP_FOR_FINISH_COURSE } from "src/constants/level";
import { NOTIFY_TYPE } from "src/constants/notify-type";
import { RedisKey } from "src/constants/redis-key";
import { CodingExercise } from "src/entities/coding-exercise.entity";
import { Course } from "src/entities/course.entity";
import { Lesson } from "src/entities/lesson.entity";
import { MultipleChoiceExercise } from "src/entities/multiple-choice-exercise.entity";
import { QuizExercise } from "src/entities/quiz-exercise.entity";
import { User } from "src/entities/user.entity";
import { UserCourseCompletion } from "src/entities/user-course-completion";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";
import {
	convertToMapData,
	parseToRedisData,
} from "src/utils/convert-redis.util";
import { localDate } from "src/utils/convert-time.util";
import { calculateLevel, generateRandomRewards } from "src/utils/levels.util";

import { AchievementService } from "../achievement/achievement.service";
import { NotificationService } from "../notification/notification.service";

import { RedisService } from "./../cache/cache.service";
import { CreateUserSubmissionDto } from "./dto/create-user-submission.dto";

@Injectable()
export class UserSubmissionService {
	constructor(
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(UserCourseCompletion)
		private userCourseCompletionRepository: Repository<UserCourseCompletion>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(QuizExercise)
		private quizExerciseRepository: Repository<QuizExercise>,
		@InjectRepository(CodingExercise)
		private codingExerciseRepository: Repository<CodingExercise>,
		@InjectRepository(MultipleChoiceExercise)
		private multipleChoiceExerciseRepository: Repository<MultipleChoiceExercise>,
		@InjectRepository(Lesson)
		private lessonRepository: Repository<Lesson>,
		@InjectRepository(UserStreak)
		private userStreakRepository: Repository<UserStreak>,
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		private redisService: RedisService,
		private notificationService: NotificationService,
		private achievementService: AchievementService,
	) {}

	async isCourseComplete(userId: string, courseId: number) {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		const course = await this.courseRepository.findOneBy({
			id: courseId,
		});
		if (!course) {
			throw new NotFoundException(COURSE_ERRORS.NOT_FOUND);
		}
		const numberOfLesson = await this.lessonRepository
			.createQueryBuilder("lesson")
			.innerJoin("lesson.chapter", "chapter")
			.where("chapter.courseId = :courseId", { courseId })
			.getCount();

		const numberOfCompletedLesson = await this.userLessonProgressRepository
			.createQueryBuilder("userLesson")
			.innerJoin("userLesson.lesson", "lesson")
			.innerJoin("lesson.chapter", "chapter")
			.where("userLesson.userId = :userId", { userId })
			.andWhere("chapter.courseId = :courseId", { courseId })
			.getCount();

		if (numberOfLesson === numberOfCompletedLesson) {
			const userCourseCompletion =
				await this.userCourseCompletionRepository.findOneBy({
					userId,
					courseId,
				});
			if (userCourseCompletion) {
				throw new BadRequestException(COURSE_ERRORS.ALREADY_FINISH);
			}
			if (!userCourseCompletion) {
				await this.userCourseCompletionRepository.insert({
					userId,
					courseId,
					certificateUrl: "www.example.com/certificate",
				});
			}

			await this.notificationService.pushToUser(userId, {
				type: NOTIFY_TYPE.FINISH_COURSE.type,
				message: NOTIFY_TYPE.FINISH_COURSE.message(course.title),
				courseId: courseId,
			});

			const userStats = calculateLevel(
				user.currentExp,
				user.level,
				EXP_FOR_FINISH_COURSE,
			);
			await this.userRepository.update(userId, {
				currentExp: userStats.curExp,
				level: userStats.curLevel,
				expToLevelUp: userStats.expToLevelUp,
				borderUrl: userStats.rankBorder,
				rankTitle: userStats.rankTitle,
				totalExpGainedToday: user.totalExpGainedToday + EXP_FOR_FINISH_COURSE,
			});
			return {
				...userStats,
				totalExpGainedToday: user.totalExpGainedToday + EXP_FOR_FINISH_COURSE,
				expGained: EXP_FOR_FINISH_COURSE,
			};
		}
		return null;
	}

	async handleSubmissionLogic(
		id: string,
		createUserSubmissionDto: CreateUserSubmissionDto,
	) {
		const { lessonId, userAnswer } = createUserSubmissionDto;
		const isExist = await this.userLessonProgressRepository.existsBy({
			userId: id,
			lessonId: lessonId,
		});
		const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
		if (!lesson) {
			throw new NotFoundException(LESSON_ERRORS.NOT_FOUND);
		}
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		const itemInUsed = await this.redisService.getMap(RedisKey.userItemXP(id));
		if (isExist) {
			console.log("User already submitted this lesson");
			return await this.handleUserSubmission(
				user,
				lesson,
				userAnswer,
				Object.keys(itemInUsed).length > 0
					? parseInt(itemInUsed.bonus)
					: undefined,
				true,
			);
		}
		const userStats = await this.handleUserSubmission(
			user,
			lesson,
			userAnswer,
			Object.keys(itemInUsed).length > 0
				? parseInt(itemInUsed.bonus)
				: undefined,
		);
		this.handleUserStreakAndAchievement(user.id, userStats);
		return userStats;
	}

	private async handleUserStreakAndAchievement(userId: string, userStats) {
		await this.handleUserStreak(
			userId,
			userStats.userLessonProgress ? true : false,
		);
		this.achievementService.handleUserAchievement(userId);
	}

	private async handleUserStreak(userId: string, isCorrect: boolean = false) {
		console.log(userId, isCorrect);
		const userStreak = await this.userStreakRepository.findOneBy({ userId });

		if (!userStreak) {
			await this.userStreakRepository.insert({
				userId,
				curDailyStreak: isCorrect ? 1 : 0,
				maxDailyStreak: isCorrect ? 1 : 0,
				curCorrectStreak: isCorrect ? 1 : 0,
				maxCorrectStreak: isCorrect ? 1 : 0,
			});
			return;
		}

		const lastSubmission = await this.userLessonProgressRepository.findOne({
			where: { userId },
			order: { createdAt: "DESC" },
		});
		let lastDateStr;
		let nearestDateWithLastSubmission;
		let countNumberOfSubmissionInDay;
		let updatedDailyStreak = userStreak.curDailyStreak;
		let updatedMaxDailyStreak = userStreak.maxDailyStreak;
		if (lastSubmission) {
			lastDateStr = localDate(lastSubmission.createdAt)
				.toISOString()
				.split("T")[0];
			console.log("lastDatestr", lastDateStr);
			countNumberOfSubmissionInDay = await this.userLessonProgressRepository
				.createQueryBuilder("ulp")
				.where("ulp.userId = :userId", { userId })
				.andWhere("CAST(ulp.createdAt AS DATE) = :date", { date: lastDateStr })
				.getCount();
		}

		if (lastSubmission && isCorrect && countNumberOfSubmissionInDay === 1) {
			nearestDateWithLastSubmission = await this.userLessonProgressRepository
				.createQueryBuilder("ulp")
				.where("ulp.userId = :userId", { userId })
				.andWhere("ulp.createdAt < :lastCreatedAt", {
					lastCreatedAt: lastSubmission.createdAt,
				})
				.andWhere("CAST(ulp.createdAt AS DATE) <> :lastDateStr", {
					lastDateStr,
				})
				.orderBy("ulp.createdAt", "DESC")
				.getOne();
			const nearestDateWithLastSubmissionStr = nearestDateWithLastSubmission
				? localDate(nearestDateWithLastSubmission?.createdAt)
						.toISOString()
						.split("T")[0]
				: 0;
			if (updatedMaxDailyStreak === 0) {
				updatedMaxDailyStreak = 1;
				updatedDailyStreak = 1;
			} else if (lastDateStr !== nearestDateWithLastSubmissionStr) {
				const lastDateOnly = new Date(lastDateStr);
				const nearestDateOnly = new Date(nearestDateWithLastSubmissionStr);
				const timeDiff = lastDateOnly.getTime() - nearestDateOnly.getTime();
				console.log(timeDiff);
				const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
				console.log("day diff", daysDiff);
				if (
					daysDiff === 1 ||
					(await this.redisService.get(RedisKey.userItemDailyStreak(userId)))
				) {
					updatedDailyStreak += 1;
					updatedMaxDailyStreak = Math.max(
						updatedMaxDailyStreak,
						updatedDailyStreak,
					);
				} else if (daysDiff > 1 && !(await this.isUseProtectItem(userId))) {
					updatedDailyStreak = 1;
				}
			}
		}

		const updatedCorrectStreak = isCorrect
			? userStreak.curCorrectStreak + 1
			: 0;

		const updatedMaxCorrectStreak = Math.max(
			userStreak.maxCorrectStreak,
			updatedCorrectStreak,
		);

		await this.userStreakRepository.update(
			{ userId },
			{
				curDailyStreak: updatedDailyStreak,
				maxDailyStreak: updatedMaxDailyStreak,
				curCorrectStreak: updatedCorrectStreak,
				maxCorrectStreak: updatedMaxCorrectStreak,
			},
		);
	}

	private async handleUserSubmission(
		user: User,
		lesson: Lesson,
		userAnswer: string,
		bonus: number = 0,
		isRedo: boolean = false,
	) {
		let exercise:
			| QuizExercise
			| CodingExercise
			| MultipleChoiceExercise
			| null = null;
		if (lesson.codingExerciseId) {
			exercise = await this.codingExerciseRepository.findOneBy({
				id: lesson.codingExerciseId,
			});
		} else if (lesson.quizExerciseId) {
			exercise = await this.quizExerciseRepository.findOneBy({
				id: lesson.quizExerciseId,
			});
		} else if (lesson.multipleChoiceExerciseId) {
			exercise = await this.multipleChoiceExerciseRepository.findOneBy({
				id: lesson.multipleChoiceExerciseId,
			});
		}
		if (!exercise) {
			throw new NotFoundException(EXERCISE_ERRORS.NOT_FOUND);
		}

		let freeSolution = false;
		const userFreeSolution: string | null = await this.redisService.get(
			RedisKey.userFreeSolution(user.id),
		);
		if (
			userFreeSolution &&
			JSON.parse(userFreeSolution).includes(lesson.id.toString())
		) {
			freeSolution = true;
		}
		if (userAnswer === exercise.answer && !isRedo) {
			this.updateRedis(user.id, lesson.id);
			const { expGained, gemsGained, expBonus } = generateRandomRewards(
				lesson.difficulty,
				bonus,
			);
			const userStats = calculateLevel(
				user.currentExp,
				user.level,
				freeSolution ? 0 : expGained + expBonus,
			);
			await this.userRepository.update(user.id, {
				currentExp: userStats.curExp,
				level: userStats.curLevel,
				expToLevelUp: userStats.expToLevelUp,
				borderUrl: userStats.rankBorder,
				rankTitle: userStats.rankTitle,
				gems: freeSolution ? user.gems : user.gems + gemsGained,
				totalExpGainedToday: freeSolution
					? Number(user.totalExpGainedToday)
					: Number(user.totalExpGainedToday) +
						Number(expGained) +
						Number(expBonus),
			});
			const userLessonProgress = await this.userLessonProgressRepository.save({
				userId: user.id,
				lessonId: lesson.id,
			});
			return {
				userStats: {
					...userStats,
					gemsGained: freeSolution ? 0 : gemsGained,
					expGained: freeSolution ? 0 : expGained,
					expBonus: freeSolution ? 0 : expBonus,
				},
				userLessonProgress,
				isRedo,
			};
		} else if (userAnswer === exercise.answer && isRedo) {
			return {
				userStats: null,
				userLessonProgress: null,
				isRedo,
			};
		}
		return {
			userStats: null,
			userLessonProgress: null,
			isRedo: false,
		};
	}

	private async isUseProtectItem(userId: string) {
		const data = await this.redisService.get(
			RedisKey.userItemDailyStreak(userId),
		);
		if (data) {
			return true;
		}
		return false;
	}

	private async updateRedis(userId: string, lessonId: number) {
		const rawData = await this.redisService.getMap(
			RedisKey.userItemUnlock(userId),
		);
		if (Object.keys(rawData).length > 0) {
			const data = convertToMapData(rawData);
			for (const key in data) {
				if (data[key]?.includes(lessonId)) {
					data[key] = data[key].filter(lesson => lesson !== lessonId);
				}
			}
			const redisData = parseToRedisData(data);
			this.redisService.setMap(RedisKey.userItemUnlock(userId), redisData, 0);
		}
		const userFreeSolution: string | null = await this.redisService.get(
			RedisKey.userFreeSolution(userId),
		);
		if (
			userFreeSolution &&
			JSON.parse(userFreeSolution).includes(lessonId.toString())
		) {
			const data = JSON.parse(userFreeSolution);
			const newData = data.filter(lesson => lesson !== lessonId.toString());
			if (newData.length > 0) {
				this.redisService.set(
					RedisKey.userFreeSolution(userId),
					JSON.stringify(newData),
					0,
				);
			} else {
				this.redisService.del(RedisKey.userFreeSolution(userId));
			}
		}
	}
}
