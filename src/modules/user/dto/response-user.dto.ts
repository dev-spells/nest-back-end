import { ApiProperty } from "@nestjs/swagger";

export class UserStreakResponseDto {
	@ApiProperty()
	curDailyStreak: number;

	@ApiProperty()
	curCorrectStreak: number;
}

export class UserGeneralInfoResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;

	@ApiProperty({ nullable: true })
	avatarUrl: string;

	@ApiProperty()
	level: number;

	@ApiProperty()
	currentExp: number;

	@ApiProperty()
	expToLevelUp: number;

	@ApiProperty()
	rankTitle: string;

	@ApiProperty()
	gems: number;

	@ApiProperty({ type: () => UserStreakResponseDto })
	userStreak: UserStreakResponseDto;
}

/* */

export class UserInfoDetailResponseDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	joinedAt: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	level: number;

	@ApiProperty()
	currentExp: number;

	@ApiProperty()
	rankTitle: string;

	@ApiProperty()
	gems: number;

	@ApiProperty({ nullable: true })
	avatarUrl: string;

	@ApiProperty()
	description: string;
}

export class UserCourseCompletedDto {
	@ApiProperty()
	userId: string;

	@ApiProperty()
	courseId: number;

	@ApiProperty()
	createdAt: string;

	@ApiProperty()
	certificateUrl: string;
}

export class UserAchievementDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	achievementType: string;

	@ApiProperty()
	achievementName: string;

	@ApiProperty()
	updatedAt: string;
}

export class UserLessonProgressDto {
	@ApiProperty()
	date: string;

	@ApiProperty()
	count: number;
}

export class UserDetailResponseDto {
	@ApiProperty({ type: () => UserInfoDetailResponseDto })
	user: UserInfoDetailResponseDto;

	@ApiProperty({ type: () => [UserCourseCompletedDto] })
	userCourseCompleted: UserCourseCompletedDto[];

	@ApiProperty({ type: () => [UserAchievementDto] })
	userAchievement: UserAchievementDto[];

	@ApiProperty({ type: () => [UserLessonProgressDto] })
	userLessonProgress: UserLessonProgressDto[];
}
