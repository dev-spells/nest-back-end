import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RedisKey } from "src/constants/redis-key";
import { Course } from "src/entities/course.entity";
import { Item } from "src/entities/item.entity";
import { Shop } from "src/entities/shop.entity";
import { User } from "src/entities/user.entity";
import {
	FeedbackStatus,
	UserFeedback,
} from "src/entities/user-feedback.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { RedisService } from "../cache/cache.service";

type TimeGroup = "day" | "month" | "year";

@Injectable()
export class AnalyticService {
	constructor(
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
		@InjectRepository(Shop)
		private shopRepository: Repository<Shop>,
		@InjectRepository(UserFeedback)
		private userFeedbackRepository: Repository<UserFeedback>,
		private redisService: RedisService,
	) {}

	async getAll(groupBy: TimeGroup = "day") {
		const cacheKey = RedisKey.analytic + groupBy;
		let analytics = await this.redisService.get(cacheKey);

		if (!analytics) {
			analytics = {
				totalMember: await this.getTotalMember(),
				totalCourse: await this.totalCourse(),
				totalItem: await this.totalItem(),
				totalItemInShop: await this.totalShop(),
				totalOpenUserFeedback: await this.getTotalOpenUserFeedback(),
				// lessonComplete: await this.getLessonComplete(groupBy),
				userJoin: await this.getUsersJoin(groupBy),
				courseJoin: await this.getCoursesJoin(),
			};

			await this.redisService.set(cacheKey, analytics, 60 * 60 * 24);
		}

		return analytics;
	}

	private async getTotalOpenUserFeedback() {
		const totalOpenUserFeedback = await this.userFeedbackRepository.count({
			where: {
				status: FeedbackStatus.OPEN,
			},
		});
		return totalOpenUserFeedback;
	}

	private async getTotalMember() {
		const totalMember = await this.userRepository.count();
		return totalMember;
	}

	// private async getLessonComplete(groupBy: TimeGroup) {
	// 	const dateFormat = this.getDateFormat(groupBy);
	// 	const lessonComplete = await this.userLessonProgressRepository
	// 		.createQueryBuilder("progress")
	// 		.select(`TO_CHAR(progress.createdAt, '${dateFormat}')`, "date")
	// 		.addSelect("COUNT(*)", "count")
	// 		.where("progress.createdAt IS NOT NULL")
	// 		.groupBy("date")
	// 		.orderBy("date", "ASC")
	// 		.limit(40)
	// 		.getRawMany();

	// 	return lessonComplete.map(item => ({
	// 		// name: localDate(item.date),
	// 		name: item.date,
	// 		value: parseInt(item.count),
	// 	}));
	// }

	private async getUsersJoin(groupBy: TimeGroup) {
		const dateFormat = this.getDateFormat(groupBy);
		const usersJoin = await this.userRepository
			.createQueryBuilder("user")
			.select(`TO_CHAR(user.joinedAt, '${dateFormat}')`, "date")
			.addSelect("COUNT(*)", "count")
			.groupBy("date")
			.orderBy("date", "ASC")
			.limit(40)
			.getRawMany();

		return usersJoin.map(item => ({
			// name: localDate(item.date),
			name: item.date,
			value: parseInt(item.count),
		}));
	}

	private async getCoursesJoin() {
		const coursesJoin = await this.userLessonProgressRepository
			.createQueryBuilder("progress")
			.leftJoin("progress.lesson", "lesson")
			.leftJoin("lesson.chapter", "chapter")
			.leftJoin("chapter.course", "course")
			.select("course.title", "name")
			.addSelect("COUNT(DISTINCT progress.userId)", "count")
			.where("progress.createdAt IS NOT NULL")
			.groupBy("course.id")
			.addGroupBy("course.title")
			.orderBy("count", "DESC")
			.limit(40)
			.getRawMany();

		return coursesJoin.map(item => ({
			name: item.name || "Uncategorized",
			value: parseInt(item.count),
		}));
	}

	private async totalCourse() {
		return await this.courseRepository.count();
	}

	private async totalItem() {
		return await this.itemRepository.count();
	}

	private async totalShop() {
		return await this.shopRepository.count();
	}

	private getDateFormat(groupBy: TimeGroup): string {
		switch (groupBy) {
			case "day":
				return "YYYY-MM-DD";
			case "month":
				return "YYYY-MM";
			case "year":
				return "YYYY";
			default:
				return "YYYY-MM-DD";
		}
	}
}
