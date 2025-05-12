import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { RedisModule } from "../cache/cache.module";

import { AnalyticController } from "./analytic.controller";
import { AnalyticService } from "./analytic.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserLessonProgress, User]), RedisModule],
	controllers: [AnalyticController],
	providers: [AnalyticService],
})
export class AnalyticModule {}
