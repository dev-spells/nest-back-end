import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { RedisModule } from "../cache/cache.module";

import { LeaderboardController } from "./leaderboard.controller";
import { LeaderboardService } from "./leaderboard.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, UserLessonProgress]), RedisModule],
	controllers: [LeaderboardController],
	providers: [LeaderboardService],
})
export class LeaderboardModule {}
