import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CodingExercise } from "src/entities/coding-exercise.entity";
import { Lesson } from "src/entities/lesson.entity";
import { MultipleChoiceExercise } from "src/entities/multiple-choice-exercise.entity";
import { QuizExercise } from "src/entities/quiz-exercise.entity";
import { User } from "src/entities/user.entity";
import { UserCourseCompletion } from "src/entities/user-course-completion";
import { UserLessonProgress } from "src/entities/user-lessson-progress.entity";
import { UserStreak } from "src/entities/user-streak.entity";

import { RedisModule } from "../cache/cache.module";

import { UserSubmissionController } from "./user-submission.controller";
import { UserSubmissionService } from "./user-submission.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserLessonProgress,
			UserCourseCompletion,
			User,
			QuizExercise,
			MultipleChoiceExercise,
			CodingExercise,
			Lesson,
			UserStreak,
		]),
		RedisModule,
	],
	controllers: [UserSubmissionController],
	providers: [UserSubmissionService],
})
export class UserSubmissionModule {}
