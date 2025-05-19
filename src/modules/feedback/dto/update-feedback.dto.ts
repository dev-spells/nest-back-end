import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { FeedbackStatus } from "src/entities/user-feedback.entity";

export class UpdateFeedbackDto {
	@ApiProperty({ enum: FeedbackStatus })
	@IsOptional()
	@IsEnum(FeedbackStatus)
	status?: FeedbackStatus;
}
