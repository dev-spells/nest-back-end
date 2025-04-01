import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "src/auth/auth.module";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";

import { RedisModule } from "./modules/cache/cache.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { CourseModule } from "./modules/course/course.module";
import { LessonModule } from "./modules/lesson/lesson.module";
import { MailModule } from "./modules/mail/mail.module";
import { S3Module } from "./modules/s3/s3.module";
import { UserModule } from "./modules/user/user.module";
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
				autoLoadEntities: true,
				entities: ["dist/**/*.entity{.ts,.js}"],
				synchronize: true,
				logging: false,
			}),
			inject: [ConfigService],
		}),
		RedisModule,
		AuthModule,
		UserModule,
		S3Module,
		CourseModule,
		MailModule,
		ChapterModule,
		LessonModule,
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
