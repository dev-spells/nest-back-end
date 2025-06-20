import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { RedisModule } from "../cache/cache.module";
import { NotificationModule } from "../notification/notification.module";

import { ItemProtectStreakController } from "./item-protect-streak.controller";
import { ItemProtectStreakService } from "./item-protect-streak.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserStreak, Item, UserItem, UserLessonProgress]),
		RedisModule,
		NotificationModule,
	],
	controllers: [ItemProtectStreakController],
	providers: [ItemProtectStreakService],
})
export class ItemProtectStreakModule {}
