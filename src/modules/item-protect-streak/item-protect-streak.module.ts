import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { ItemProtectStreakController } from "./item-protect-streak.controller";
import { ItemProtectStreakService } from "./item-protect-streak.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserStreak, Item, UserItem])],
	controllers: [ItemProtectStreakController],
	providers: [ItemProtectStreakService],
})
export class ItemProtectStreakModule {}
