import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { User } from "src/decorators/current-user";
import { Roles } from "src/decorators/role-route";

import {
	CreateRewardWheelDto,
	HandleRewardDto,
} from "./dto/create-reward-wheel.dto";
import {
	CheckUserWheelResponseDto,
	HandleRewardResponseDto,
	WheelRewardDto,
} from "./dto/response-reward-wheel.dto";
import { UpdateRewardWheelDto } from "./dto/update-reward-wheel.dto";
import { RewardWheelService } from "./reward-wheel.service";

@Controller("reward-wheel")
export class RewardWheelController {
	constructor(private readonly rewardWheelService: RewardWheelService) {}

	@Cron("0 0 * * *", {
		timeZone: "UTC",
	})
	async handleCron() {
		console.log("reset wheel start");
		return this.rewardWheelService.handleCron();
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Run cron job" })
	@ApiBearerAuth()
	@Post("run-cron")
	async runCron() {
		return this.rewardWheelService.handleCron();
	}

	@ApiOperation({ summary: "Check user can spin or not" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: CheckUserWheelResponseDto })
	@ApiNotFoundResponse()
	@Get("check")
	async checkUserCanSpin(@User() user: any) {
		return await this.rewardWheelService.checkUserCanSpin(user.id);
	}

	@ApiOperation({ summary: "Get wheel" })
	@ApiBearerAuth()
	@ApiOkResponse({ type: WheelRewardDto })
	@Get()
	async getWheel() {
		return await this.rewardWheelService.getWheel();
	}

	@ApiOperation({ summary: "Handle reward" })
	@ApiBearerAuth()
	@ApiCreatedResponse({
		type: HandleRewardResponseDto,
	})
	@ApiNotFoundResponse()
	@ApiBadRequestResponse()
	@Post("handle-reward")
	async handleReward(
		@User() user: any,
		@Body() handleRewardDto: HandleRewardDto,
	) {
		return await this.rewardWheelService.handleReward(user.id, handleRewardDto);
	}

	@ApiOperation({ summary: "Create wheel item" })
	@Roles(Role.ADMIN)
	@ApiBearerAuth()
	@ApiNotFoundResponse()
	@ApiBadRequestResponse()
	@Post()
	async createWheelItem(@Body() createRewardWheelDto: CreateRewardWheelDto) {
		return await this.rewardWheelService.create(createRewardWheelDto);
	}

	@ApiOperation({ summary: "Update wheel item" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@Patch()
	async updateWheelItem(@Body() updateRewardWheelDto: UpdateRewardWheelDto) {
		return await this.rewardWheelService.update(updateRewardWheelDto);
	}
}
