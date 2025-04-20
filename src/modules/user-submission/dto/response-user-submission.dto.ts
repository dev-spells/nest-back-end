import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserStatsDto {
	@ApiProperty()
	levelUp: boolean;

	@ApiProperty()
	curLevel: number;

	@ApiProperty()
	expToLevelUp: number;

	@ApiProperty()
	curExp: number;

	@ApiProperty()
	rankTitle: string;

	@ApiProperty()
	rankBorder: string;

	@ApiProperty()
	gemsGained: number;

	@ApiProperty()
	expGained: number;

	@ApiProperty()
	expBonus: number;
}

export class UserLessonProgressDto {
	@ApiProperty()
	userId: string;

	@ApiProperty()
	lessonId: number;

	@ApiProperty()
	createdAt: string;
}

export class SubmitLessonResponseDto {
	@ApiPropertyOptional({ type: UserStatsDto, nullable: true })
	userStats: UserStatsDto | null;

	@ApiPropertyOptional({ type: UserLessonProgressDto, nullable: true })
	userLessonProgress: UserLessonProgressDto | null;

	@ApiProperty()
	isRedo: boolean;
}
