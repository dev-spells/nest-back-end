import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Lesson } from "src/entities/lesson.entity";
import { UserFeedback } from "src/entities/user-feedback.entity";

import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserFeedback, Lesson])],
	controllers: [FeedbackController],
	providers: [FeedbackService],
})
export class FeedbackModule {}
