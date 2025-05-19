import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { FeedbackType } from "src/entities/user-feedback.entity";

export class CreateFeedbackDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	feedback: string;

	@ApiProperty({ enum: FeedbackType })
	@IsNotEmpty()
	@IsEnum(FeedbackType)
	feedbackType: FeedbackType;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	lessonId?: number;
}
