import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { USER_ERRORS } from "src/constants/errors";
import { RedisKey } from "src/constants/redis-key";
import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { localDate } from "src/utils/convert-time.util";
import { sanitizeGithubUsername } from "src/utils/sanitize-github-username.util";

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
		let leaderboardData: any = await this.redisService.get(
			RedisKey.topDailySubmission,
		);
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0];
		if (!leaderboardData) {
			leaderboardData = await this.userLessonRepository.query(
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
			leaderboardData.forEach(user => {
				user.lastSubmissionTime = localDate(user.lastSubmissionTime);
				user.username = sanitizeGithubUsername(user.username);
			});
			await this.redisService.set(
				RedisKey.topDailySubmission,
				leaderboardData,
				60 * 5,
			);
		}

		// Current user's rank
		const userRank = await this.userLessonRepository.query(
			`
		    WITH ranked_submissions AS (
		        SELECT
		           	ulp."userId",
		            u.username,
		            u."rankTitle",
		            u."avatarUrl",
		            COUNT(ulp."lessonId") AS "submissionCount",
		            RANK() OVER (
		                ORDER BY COUNT(ulp."lessonId") DESC, MAX(ulp."createdAt") ASC
		            ) AS rank
		        FROM user_lesson_progress ulp
				JOIN "user" u ON u.id = ulp."userId"
		        WHERE CAST(ulp."createdAt" AS DATE) = $1
		        GROUP BY ulp."userId", u.username, u."rankTitle", u."avatarUrl"
		    )
		    SELECT * 
		    FROM ranked_submissions WHERE "userId" = $2
		    `,
			[todayStr, userId],
		);

		if (userRank.length > 0) {
			userRank[0].lastSubmissionTime = localDate(
				userRank[0].lastSubmissionTime,
			);
			userRank[0].username = sanitizeGithubUsername(userRank[0].username);
		}

		return {
			userRank: userRank[0] ?? null,
			topUsers: leaderboardData,
		};
	}

	async getRankHighestLevel(userId: string) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}

		let leaderboardData: any = await this.redisService.get(
			RedisKey.userTopLevel,
		);
		if (!leaderboardData) {
			leaderboardData = await this.userRepository.query(
				`
				WITH ranked_levels AS (
				  SELECT
					u.id AS "userId",
					u.username,
					u."rankTitle",
					u."avatarUrl",
					u.level,
					RANK() OVER (
					  ORDER BY u.level DESC
					) AS rank
				  FROM "user" u
				)
				SELECT * FROM ranked_levels
				ORDER BY rank
				LIMIT 15
				`,
			);
			leaderboardData.forEach(user => {
				user.username = sanitizeGithubUsername(user.username);
			});
			await this.redisService.set(
				RedisKey.userTopLevel,
				leaderboardData,
				60 * 5,
			);
		}

		const userRank = await this.userRepository.query(
			`
			WITH ranked_levels AS (
			  SELECT
				u.id AS "userId",
				u.username,
				u."rankTitle",
				u."avatarUrl",
				u.level,
				RANK() OVER (
				  ORDER BY u.level DESC
				) AS rank
			  FROM "user" u
			)
			SELECT *
			FROM ranked_levels WHERE "userId" = $1
			`,
			[userId],
		);

		userRank[0].username = sanitizeGithubUsername(user.username);

		return {
			userRank: userRank[0] ?? null,
			topUsers: leaderboardData,
		};
	}
}
