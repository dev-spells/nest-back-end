import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";
import { WheelItem } from "src/entities/wheel-item.entity";

import { RewardWheelController } from "./reward-wheel.controller";
import { RewardWheelService } from "./reward-wheel.service";

@Module({
	imports: [TypeOrmModule.forFeature([WheelItem, UserItem, User])],
	controllers: [RewardWheelController],
	providers: [RewardWheelService],
})
export class RewardWheelModule {}
