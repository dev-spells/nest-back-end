import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserAchievement } from "src/entities/user-achievement.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { NotificationModule } from "../notification/notification.module";

import { AchievementController } from "./achievement.controller";
import { AchievementService } from "./achievement.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAchievement, UserLessonProgress, UserStreak]),
		NotificationModule,
	],
	controllers: [AchievementController],
	providers: [AchievementService],
	exports: [AchievementService],
})
export class AchievementModule {}
