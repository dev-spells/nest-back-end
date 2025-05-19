import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { LESSON_ERRORS, USER_FEEDBACK_ERRORS } from "src/constants/errors";
import { Lesson } from "src/entities/lesson.entity";
import { UserFeedback } from "src/entities/user-feedback.entity";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import {
	FeedbackResultDto,
	GetFeedbackResponse,
	MetaDto,
} from "./dto/response-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(UserFeedback)
		private readonly userFeedbackRepository: Repository<UserFeedback>,
		@InjectRepository(Lesson)
		private readonly lessonRepository: Repository<Lesson>,
	) {}

	async create(userId: string, createFeedbackDto: CreateFeedbackDto) {
		if (
			createFeedbackDto.lessonId &&
			!(await this.lessonRepository.exists({
				where: { id: createFeedbackDto.lessonId },
			}))
		) {
			throw new NotFoundException(LESSON_ERRORS.NOT_FOUND);
		}
		return this.userFeedbackRepository.save({
			...createFeedbackDto,
			lesson: { id: createFeedbackDto.lessonId },
			user: { id: userId },
		});
	}

	async findAll({ filter, sort }: { filter: any; sort: any }) {
		const allowedSortColumns = ["id", "createdAt", "feedbackType", "status"];

		const { pageSize, current, q, ...restFilter } = filter;

		if (sort) {
			const sortField = Object.keys(sort);
			sortField.forEach(field => {
				if (allowedSortColumns.includes(field) === false)
					throw new BadRequestException(`Invalid sort column: ${field}`);
			});
		}

		const where: any = { ...restFilter };
		if (q) {
			where.feedback = ILike(`%${q}%`);
		}
		if (filter.feedbackType) {
			where.feedbackType = filter.feedbackType;
		}
		if (filter.status) {
			where.status = filter.status;
		}

		const [results, totalItems] =
			await this.userFeedbackRepository.findAndCount({
				where: {
					...where,
				},
				order: sort,
				take: pageSize,
				skip: (current - 1) * pageSize,
				relations: {
					lesson: {
						chapter: {
							course: true,
						},
					},
					user: true,
				},
			});

		const customizedResults = results.map(feedback => ({
			id: feedback.id,
			user: {
				userId: feedback.user.id,
				username: feedback.user.username,
				email: feedback.user.email,
				avatarUrl: feedback.user.avatarUrl,
			},
			lesson: {
				lessonId: feedback.lesson.id,
				lessonName: feedback.lesson.name,
				chapter: {
					chapterId: feedback.lesson.chapter.id,
					chapterName: feedback.lesson.chapter.name,
					course: {
						courseId: feedback.lesson.chapter.course.id,
						courseName: feedback.lesson.chapter.course.title,
					},
				},
			},
			createdAt: feedback.createdAt,
			status: feedback.status,
			feedback: feedback.feedback,
			feedbackType: feedback.feedbackType,
		}));

		const meta: MetaDto = {
			current: current,
			pageSize: pageSize,
			pages: Math.ceil(totalItems / pageSize),
			total: totalItems,
		};

		const response: GetFeedbackResponse = {
			feedbacks: customizedResults as unknown as FeedbackResultDto[],
			meta: meta,
		};

		return response;
	}

	async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
		const feedback = await this.userFeedbackRepository.findOne({
			where: { id },
		});
		if (!feedback) {
			throw new NotFoundException(USER_FEEDBACK_ERRORS.NOT_FOUND);
		}
		return this.userFeedbackRepository.update(id, updateFeedbackDto);
	}
}
