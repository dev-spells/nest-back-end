import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AchievementProgressDetailDto {
	@ApiPropertyOptional({ example: "Novice", nullable: true })
	currentBadge: string | null;

	@ApiProperty({ example: 12 })
	currentProgress: number;

	@ApiPropertyOptional({ example: "Explorer", nullable: true })
	nextBadge: string | null;

	@ApiPropertyOptional({ example: 30, nullable: true })
	nextThreshold: number | null;
}

export class AchievementProgressResponseDto {
	@ApiProperty({ type: AchievementProgressDetailDto })
	NUMBER_OF_LESSONS: AchievementProgressDetailDto;

	@ApiProperty({ type: AchievementProgressDetailDto })
	DAILY_STREAK: AchievementProgressDetailDto;

	@ApiProperty({ type: AchievementProgressDetailDto })
	CORRECT_STREAK: AchievementProgressDetailDto;
}

export class AchievementResponseDto {
	@ApiProperty({ example: "accuracy-achievement" })
	achievementType: string;

	@ApiProperty({ example: "Accuracy Skilled" })
	achievementName: string;
}
