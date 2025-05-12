import { PartialType } from '@nestjs/swagger';
import { CreateRewardWheelDto } from './create-reward-wheel.dto';

export class UpdateRewardWheelDto extends PartialType(CreateRewardWheelDto) {}
