import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RedisKey } from "src/constants/redis-key";
import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { localDate } from "src/utils/convert-time.util";

import { RedisService } from "../cache/cache.service";

type TimeGroup = "day" | "month" | "year";

@Injectable()
export class AnalyticService {
	constructor(
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private redisService: RedisService,
	) {}

	async getAll(groupBy: TimeGroup = "day") {
		const cacheKey = RedisKey.analytic + groupBy;
		let analytics = await this.redisService.get(cacheKey);

		if (!analytics) {
			analytics = {
				totalMember: await this.getTotalMember(),
				lessonComplete: await this.getLessonComplete(groupBy),
				userJoin: await this.getUsersJoin(groupBy),
				courseJoin: await this.getCoursesJoin(),
			};

			await this.redisService.set(cacheKey, analytics, 60 * 60 * 24);
		}

		return analytics;
	}

	private async getTotalMember() {
		const totalMember = await this.userRepository.count();
		return totalMember;
	}

	private async getLessonComplete(groupBy: TimeGroup) {
		const dateFormat = this.getDateFormat(groupBy);
		const lessonComplete = await this.userLessonProgressRepository
			.createQueryBuilder("progress")
			.select(`TO_CHAR(progress.createdAt, '${dateFormat}')`, "date")
			.addSelect("COUNT(*)", "count")
			.where("progress.createdAt IS NOT NULL")
			.groupBy("date")
			.orderBy("date", "DESC")
			.limit(40)
			.getRawMany();

		return lessonComplete.map(item => ({
			// name: localDate(item.date),
			name: item.date,
			value: parseInt(item.count),
		}));
	}

	private async getUsersJoin(groupBy: TimeGroup) {
		const dateFormat = this.getDateFormat(groupBy);
		const usersJoin = await this.userRepository
			.createQueryBuilder("user")
			.select(`TO_CHAR(user.joinedAt, '${dateFormat}')`, "date")
			.addSelect("COUNT(*)", "count")
			.groupBy("date")
			.orderBy("date", "DESC")
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
