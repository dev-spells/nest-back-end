import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";
import { UserAchievement } from "src/entities/user-achievement.entity";
import { UserCourseCompletion } from "src/entities/user-course-completion";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { RedisModule } from "../cache/cache.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserStreak,
			UserAchievement,
			UserLessonProgress,
			UserCourseCompletion,
		]),
		RedisModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
