import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RedisKey } from "src/constants/redis-key";
import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { localDate } from "src/utils/convert-time.util";

import { RedisService } from "../cache/cache.service";

@Injectable()
export class AnalyticService {
	constructor(
		@InjectRepository(UserLessonProgress)
		private userLessonProgressRepository: Repository<UserLessonProgress>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private redisService: RedisService,
	) {}

	async getAll() {
		let analytics = await this.redisService.get(RedisKey.analytic);

		if (!analytics) {
			analytics = {
				totalMember: await this.getTotalMember(),
				lessonComplete: await this.getLessonComplete(),
				userJoin: await this.getUsersJoin(),
				courseJoin: await this.getCoursesJoin(),
			};

			await this.redisService.set(RedisKey.analytic, analytics, 60 * 60 * 24);
		}

		return analytics;
	}

	private async getTotalMember() {
		const totalMember = await this.userRepository.count();
		return totalMember;
	}

	private async getLessonComplete() {
		const lessonComplete = await this.userLessonProgressRepository
			.createQueryBuilder("progress")
			.select("DATE(progress.createdAt)", "date")
			.addSelect("COUNT(*)", "count")
			.where("progress.createdAt IS NOT NULL")
			.groupBy("date")
			.orderBy("date", "DESC")
			.getRawMany();

		return lessonComplete.map(item => ({
			name: localDate(item.date),
			value: parseInt(item.count),
		}));
	}

	private async getUsersJoin() {
		const usersJoin = await this.userRepository
			.createQueryBuilder("user")
			.select("DATE(user.joinedAt)", "date")
			.addSelect("COUNT(*)", "count")
			.groupBy("date")
			.orderBy("date", "DESC")
			.getRawMany();

		return usersJoin.map(item => ({
			name: localDate(item.date),
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
			.getRawMany();

		return coursesJoin.map(item => ({
			name: item.name || "Uncategorized",
			value: parseInt(item.count),
		}));
	}
}
