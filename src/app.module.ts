import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "src/auth/auth.module";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { AchievementModule } from "./modules/achievement/achievement.module";
import { AnalyticModule } from "./modules/analytic/analytic.module";
import { RedisModule } from "./modules/cache/cache.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { ChatbotModule } from "./modules/chatbot/chatbot.module";
import { CourseModule } from "./modules/course/course.module";
import { ExerciseModule } from "./modules/exercise/exercise.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { ItemModule } from "./modules/item/item.module";
import { ItemProtectStreakModule } from "./modules/item-protect-streak/item-protect-streak.module";
import { ItemUnlockModule } from "./modules/item-unlock/item-unlock.module";
import { ItemXpModule } from "./modules/item-xp/item-xp.module";
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module";
import { LessonModule } from "./modules/lesson/lesson.module";
import { MailModule } from "./modules/mail/mail.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { RewardWheelModule } from "./modules/reward-wheel/reward-wheel.module";
import { S3Module } from "./modules/s3/s3.module";
import { ShopModule } from "./modules/shop/shop.module";
import { SpellBookModule } from "./modules/spell-book/spell-book.module";
import { UserModule } from "./modules/user/user.module";
import { UserSubmissionModule } from "./modules/user-submission/user-submission.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				url: configService.get<string>("DATABASE_URL"),
				// autoLoadEntities: configService.get<boolean>("AUTO_LOAD_ENTITIES"),
				// entities: ["dist/**/*.entity{.ts,.js}"],
				synchronize: configService.get<boolean>("SYNCHRONIZE"),
				logging: false,
			}),
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		RedisModule,
		AuthModule,
		UserModule,
		S3Module,
		CourseModule,
		MailModule,
		ChapterModule,
		LessonModule,
		ExerciseModule,
		SpellBookModule,
		UserSubmissionModule,
		ShopModule,
		ItemXpModule,
		ItemModule,
		ItemUnlockModule,
		ItemProtectStreakModule,
		NotificationModule,
		AchievementModule,
		LeaderboardModule,
		ChatbotModule,
		AnalyticModule,
		RewardWheelModule,
		FeedbackModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
