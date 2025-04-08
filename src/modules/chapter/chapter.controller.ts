import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";

import {
	ApiBearerAuth,
	ApiBody,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Role } from "src/constants/role.enum";
import { Roles } from "src/decorators/role-route";

import { CreateBatchChaptersDto } from "./dto/create-chapter.dto";
import { ResponseChapter } from "./dto/response-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { ChapterService } from "./chapter.service";

@ApiTags("Chapter")
@Controller("chapter")
export class ChapterController {
	constructor(private readonly chapterService: ChapterService) {}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Create batch chapters - ADMIN" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@Post("batch")
	createBatch(@Body() createBatchChaptersDto: CreateBatchChaptersDto) {
		return this.chapterService.createBatchChapters(createBatchChaptersDto);
	}

	// @Roles(Role.ADMIN)
	// @ApiOperation({ summary: "Create a new chapter - ADMIN" })
	// @ApiBearerAuth()
	// @ApiOkResponse()
	// @ApiNotFoundResponse({ description: "Course not found" })
	// @Post()
	// create(@Body() createChapterDto: CreateChapterDto) {
	// 	return this.chapterService.create(createChapterDto);
	// }

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update batch chapters - ADMIN" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiBody({ type: [UpdateChapterDto] })
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@Patch("batch")
	updateBatch(@Body() updateBatchChaptersDto: UpdateChapterDto[]) {
		return this.chapterService.updateBatchChapters(updateBatchChaptersDto);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update a chapter - ADMIN" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateChapterDto: UpdateChapterDto) {
		return this.chapterService.update(+id, updateChapterDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Get chapter by ID" })
	@ApiOkResponse({ type: ResponseChapter })
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.chapterService.findOne(+id);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Delete a chapter - ADMIN" })
	@ApiBearerAuth()
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@ApiOkResponse({ description: "Chapter deleted successfully" })
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.chapterService.remove(+id);
	}
}
