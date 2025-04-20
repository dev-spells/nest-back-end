import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";

import { RedisModule } from "../cache/cache.module";

import { ItemUnlockController } from "./item-unlock.controller";
import { ItemUnlockService } from "./item-unlock.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Item, UserItem, UserLessonProgress]),
		RedisModule,
	],
	controllers: [ItemUnlockController],
	providers: [ItemUnlockService],
})
export class ItemUnlockModule {}
