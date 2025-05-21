import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Course } from "src/entities/course.entity";
import { Item } from "src/entities/item.entity";
import { Shop } from "src/entities/shop.entity";
import { User } from "src/entities/user.entity";
import { UserFeedback } from "src/entities/user-feedback.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { RedisModule } from "../cache/cache.module";

import { AnalyticController } from "./analytic.controller";
import { AnalyticService } from "./analytic.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserLessonProgress,
			User,
			Course,
			Item,
			Shop,
			UserFeedback,
		]),
		RedisModule,
	],
	controllers: [AnalyticController],
	providers: [AnalyticService],
})
export class AnalyticModule {}
