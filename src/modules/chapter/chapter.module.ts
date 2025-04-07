import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Chapter } from "src/entities/chapter.entity";
import { Lesson } from "src/entities/lesson.entity";

import { CourseModule } from "../course/course.module";

import { ChapterController } from "./chapter.controller";
import { ChapterService } from "./chapter.service";

@Module({
	imports: [TypeOrmModule.forFeature([Chapter, Lesson]), CourseModule],
	controllers: [ChapterController],
	providers: [ChapterService],
})
export class ChapterModule {}
