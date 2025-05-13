import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Item } from "src/entities/item.entity";
import { Notification } from "src/entities/notification.entity";
import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";
import { WheelItem } from "src/entities/wheel-item.entity";

import { RedisModule } from "../cache/cache.module";
import { NotificationModule } from "../notification/notification.module";

import { RewardWheelController } from "./reward-wheel.controller";
import { RewardWheelService } from "./reward-wheel.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([WheelItem, UserItem, User, Item, Notification]),
		RedisModule,
		NotificationModule,
	],
	controllers: [RewardWheelController],
	providers: [RewardWheelService],
})
export class RewardWheelModule {}
