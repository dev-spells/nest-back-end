import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";

import { USER_ERRORS } from "src/constants/errors";
import { RedisKey } from "src/constants/redis-key";
import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { localDate } from "src/utils/convert-time.util";

import { RedisService } from "../cache/cache.service";

@Injectable()
export class LeaderboardService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(UserLessonProgress)
		private userLessonRepository: Repository<UserLessonProgress>,
		private redisService: RedisService,
	) {}

	async getRankSubmissionCountDaily(userId: string) {
		const cachedData = await this.redisService.get(RedisKey.topDailySubmission);
		if (cachedData) return cachedData;

		console.log("Fetching leaderboard from cache");
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0];

		const topUsers = await this.userLessonRepository.query(
			`
		    WITH ranked_submissions AS (
		        SELECT
		            ulp."userId",
		            COUNT(ulp."lessonId") AS "submissionCount",
		            u.username,
		            u."rankTitle",
		            u."avatarUrl",
		            MAX(ulp."createdAt") AS "lastSubmissionTime",
		            RANK() OVER (
		                ORDER BY COUNT(ulp."lessonId") DESC, MAX(ulp."createdAt") ASC
		            ) AS rank
		        FROM user_lesson_progress ulp
		        JOIN "user" u ON u.id = ulp."userId"
		        WHERE CAST(ulp."createdAt" AS DATE) = $1
		        GROUP BY ulp."userId", u.username, u."rankTitle", u."avatarUrl"
		    )
		    SELECT * FROM ranked_submissions
		    ORDER BY rank
		    LIMIT 15
		    `,
			[todayStr],
		);

		// Current user's rank
		const userRank = await this.userLessonRepository.query(
			`
		    WITH ranked_submissions AS (
		        SELECT
		            ulp."userId",
		            COUNT(ulp."lessonId") AS "submissionCount",
		            RANK() OVER (
		                ORDER BY COUNT(ulp."lessonId") DESC, MAX(ulp."createdAt") ASC
		            ) AS rank
		        FROM user_lesson_progress ulp
		        WHERE CAST(ulp."createdAt" AS DATE) = $1
		        GROUP BY ulp."userId"
		    )
		    SELECT
		        "submissionCount",
		        "rank"
		    FROM ranked_submissions WHERE "userId" = $2
		    `,
			[todayStr, userId],
		);
		// format each lastSubmissionTime of topUsers

		topUsers.forEach(user => {
			user.lastSubmissionTime = localDate(user.lastSubmissionTime);
		});

		await this.redisService.set(
			RedisKey.topDailySubmission,
			{ userRank: userRank[0] ?? null, topUsers },
			60 * 5,
		);

		return {
			userRank: userRank[0] ?? null,
			topUsers,
		};
	}

	async getRankHighestLevel(userId: string) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}

		const higherCount = await this.userRepository.count({
			where: {
				level: MoreThan(user.level),
			},
		});
		const userRank = higherCount + 1;

		const topUsers = await this.userRepository.find({
			order: { level: "DESC" },
			take: 15,
			select: ["id", "username", "level", "avatarUrl", "rankTitle"],
		});

		await this.redisService.set(
			RedisKey.userTopLevel,
			{ userRank, topUsers },
			60 * 5,
		);

		return {
			userRank: {
				rank: userRank,
				level: user.level,
			},
			topUsers,
		};
	}
}
