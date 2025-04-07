import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Lesson } from "src/entities/lesson.entity";

import { ExerciseModule } from "../exercise/exercise.module";
import { SpellBookModule } from "../spell-book/spell-book.module";

import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Lesson]),
		ExerciseModule,
		SpellBookModule,
	],
	controllers: [LessonController],
	providers: [LessonService],
	exports: [LessonService],
})
export class LessonModule {}
