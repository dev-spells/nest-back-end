import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
	EXERCISE_ERRORS,
	LESSON_ERRORS,
	USER_ERRORS,
} from "src/constants/errors";
import { CodingExercise } from "src/entities/coding-exercise.entity";
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
import { calculateLevel, generateRandomRewards } from "src/utils/levels.util";

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
		private redisService: RedisService,
	) {}

	async isCourseComplete(userId: string, courseId: number) {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
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
			if (!userCourseCompletion) {
				await this.userCourseCompletionRepository.insert({
					userId,
					courseId,
					certificateUrl: "www.example.com/certificate",
				});
			}
			return true;
		}
		return false;
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

		const itemInUsed = await this.redisService.getMap(`user:${id}:item-xp`);

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
		if (userStats.userLessonProgress) {
			this.handleUserStreak(user.id, true);
		} else {
			this.handleUserStreak(user.id);
		}
		return userStats;
	}

	private async handleUserStreak(userId: string, isCorrect: boolean = false) {
		const userStreak = await this.userStreakRepository.findOneBy({ userId });

		if (!userStreak) {
			await this.userStreakRepository.insert({
				userId,
				curDailyStreak: 1,
				maxDailyStreak: 1,
				currentCorrectStreak: isCorrect ? 1 : 0,
				maxCorrectStreak: isCorrect ? 1 : 0,
			});
			return;
		}

		const lastSubmission = await this.userLessonProgressRepository.findOne({
			where: { userId },
			order: { createdAt: "DESC" },
		});
		if (!lastSubmission) {
			await this.userStreakRepository.update(userId, {
				curDailyStreak: 1,
				maxDailyStreak: 1,
				currentCorrectStreak: isCorrect ? 1 : 0,
				maxCorrectStreak: isCorrect ? 1 : 0,
			});
			return;
		}

		const currentDate = new Date();
		const currentDateStr = currentDate.toISOString().split("T")[0];

		let updatedDailyStreak = userStreak.curDailyStreak;
		let updatedMaxDailyStreak = userStreak.maxDailyStreak;

		if (lastSubmission) {
			const lastSubmissionDate = new Date(lastSubmission.createdAt);
			const lastDateStr = lastSubmissionDate.toISOString().split("T")[0];

			if (lastDateStr !== currentDateStr) {
				const timeDiff = currentDate.getTime() - lastSubmissionDate.getTime();
				const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

				if (daysDiff === 1) {
					updatedDailyStreak += 1;
					updatedMaxDailyStreak = Math.max(
						updatedMaxDailyStreak,
						updatedDailyStreak,
					);
				} else if (daysDiff > 1) {
					updatedDailyStreak = 1;
				}
			}
		} else {
			updatedDailyStreak = 1;
			updatedMaxDailyStreak = 1;
		}

		const updatedCorrectStreak = isCorrect
			? userStreak.currentCorrectStreak + 1
			: 0;

		const updatedMaxCorrectStreak = isCorrect
			? Math.max(userStreak.maxCorrectStreak, updatedCorrectStreak)
			: userStreak.maxCorrectStreak;

		await this.userStreakRepository.update(
			{ userId },
			{
				curDailyStreak: updatedDailyStreak,
				maxDailyStreak: updatedMaxDailyStreak,
				currentCorrectStreak: updatedCorrectStreak,
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

		if (userAnswer === exercise.answer && !isRedo) {
			this.updateRedis(user.id, lesson.id);
			const { expGained, gemsGained, expBonus } = generateRandomRewards(
				lesson.difficulty,
				bonus,
			);
			const userStats = calculateLevel(
				user.currentExp,
				user.level,
				expGained + expBonus,
			);
			await this.userRepository.update(user.id, {
				currentExp: userStats.curExp,
				level: userStats.curLevel,
				expToLevelUp: userStats.expToLevelUp,
				borderUrl: userStats.rankBorder,
				rankTitle: userStats.rankTitle,
				gems: user.gems + gemsGained,
			});
			const userLessonProgress = await this.userLessonProgressRepository.save({
				userId: user.id,
				lessonId: lesson.id,
			});
			return {
				userStats: {
					...userStats,
					gemsGained,
					expGained,
					expBonus,
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

	private async updateRedis(userId: string, lessonId: number) {
		const rawData = await this.redisService.getMap(
			`user:${userId}:item-unlock`,
		);
		const data = convertToMapData(rawData);
		for (const key in data) {
			if (data[key].includes(lessonId)) {
				data[key] = data[key].filter(lesson => lesson !== lessonId);
			}
		}
		const redisData = parseToRedisData(data);
		console.log(redisData);
		this.redisService.setMap(`user:${userId}:item-unlock`, redisData, 0);
	}
}
