import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

@Controller("lesson")
export class LessonController {
	constructor(private readonly lessonService: LessonService) {}

	@Post()
	create(@Body() createLessonDto: CreateLessonDto) {
		return this.lessonService.create(createLessonDto);
	}

	@Get()
	findAll() {
		return this.lessonService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.lessonService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateLessonDto: UpdateLessonDto) {
		return this.lessonService.update(+id, updateLessonDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.lessonService.remove(+id);
	}
}
