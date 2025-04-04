import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { Roles } from "src/decorators/role-route";
import { Role } from "src/constants/role.enum";
import { ResponseChapter } from "./dto/response-chapter.dto";

@ApiTags("Chapter")
@Controller("chapter")
export class ChapterController {
	constructor(private readonly chapterService: ChapterService) {}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Create a new chapter" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiNotFoundResponse({ description: "Course not found" })
	@Post()
	create(@Body() createChapterDto: CreateChapterDto) {
		return this.chapterService.create(createChapterDto);
	}

	@Roles(Role.ADMIN)
	@ApiOperation({ summary: "Update a chapter" })
	@ApiBearerAuth()
	@ApiOkResponse()
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateChapterDto: UpdateChapterDto) {
		return this.chapterService.update(+id, updateChapterDto);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Get all chapters" })
	@ApiOkResponse({ type: [ResponseChapter] })
	@Get()
	findAll() {
		return this.chapterService.findAll();
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
	@ApiOperation({ summary: "Delete a chapter" })
	@ApiBearerAuth()
	@ApiNotFoundResponse({ description: "Chapter not found" })
	@ApiOkResponse({ description: "Chapter deleted successfully" })
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.chapterService.remove(+id);
	}
}
