import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

import { CreateRewardWheelDto } from "./dto/create-reward-wheel.dto";
import { UpdateRewardWheelDto } from "./dto/update-reward-wheel.dto";
import { RewardWheelService } from "./reward-wheel.service";

@Controller("reward-wheel")
export class RewardWheelController {
	constructor(private readonly rewardWheelService: RewardWheelService) {}

	// @Post()
	// create(@Body() createRewardWheelDto: CreateRewardWheelDto) {
	// 	return this.rewardWheelService.create(createRewardWheelDto);
	// }

	// @Get()
	// findAll() {
	// 	return this.rewardWheelService.findAll();
	// }

	// @Get(":id")
	// findOne(@Param("id") id: string) {
	// 	return this.rewardWheelService.findOne(+id);
	// }

	// @Patch(":id")
	// update(
	// 	@Param("id") id: string,
	// 	@Body() updateRewardWheelDto: UpdateRewardWheelDto,
	// ) {
	// 	return this.rewardWheelService.update(+id, updateRewardWheelDto);
	// }

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	return this.rewardWheelService.remove(+id);
	// }
}
