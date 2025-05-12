import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";
import { WheelItem } from "src/entities/wheel-item.entity";

import { CreateRewardWheelDto } from "./dto/create-reward-wheel.dto";
import { UpdateRewardWheelDto } from "./dto/update-reward-wheel.dto";

@Injectable()
export class RewardWheelService {
	constructor(
		@InjectRepository(WheelItem)
		private wheelItemRepository: Repository<WheelItem>,
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}
}
