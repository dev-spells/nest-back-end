import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "src/entities/course.entity";
import { UserCourseCompletion } from "src/entities/user-course-completion";
import { S3Module } from "../s3/s3.module";

@Module({
	imports: [TypeOrmModule.forFeature([Course, UserCourseCompletion]), S3Module],
	controllers: [CourseController],
	providers: [CourseService],
})
export class CourseModule {}
