import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Item } from "src/entities/item.entity";
import { UserItem } from "src/entities/user-item.entity";

import { RedisModule } from "../cache/cache.module";

import { ItemXpController } from "./item-xp.controller";
import { ItemXpService } from "./item-xp.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserItem, Item]), RedisModule],
	controllers: [ItemXpController],
	providers: [ItemXpService],
})
export class ItemXpModule {}
