import { Module } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { ChapterController } from "./chapter.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chapter } from "src/entities/chapter.entity";
import { CourseModule } from "../course/course.module";

@Module({
	imports: [TypeOrmModule.forFeature([Chapter]), CourseModule],
	controllers: [ChapterController],
	providers: [ChapterService],
})
export class ChapterModule {}
