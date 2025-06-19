import { ApiProperty } from "@nestjs/swagger";

class LevelUserRankDto {
	@ApiProperty({ example: 1 })
	rank: number;

	@ApiProperty({ example: 19 })
	level: number;
}

class LevelTopUserDto {
	@ApiProperty({ example: "ed1fec91-a425-4083-aa58-03ecc1b3419c" })
	id: string;

	@ApiProperty({ example: "gaumeodathanh" })
	username: string;

	@ApiProperty({ example: null, nullable: true })
	avatarUrl: string | null;

	@ApiProperty({ example: 19 })
	level: number;

	@ApiProperty({ example: "Silver" })
	rankTitle: string;
}

export class LevelLeaderboardResponseDto {
	@ApiProperty({ type: LevelUserRankDto })
	userRank: LevelUserRankDto;

	@ApiProperty({ type: [LevelTopUserDto] })
	topUsers: LevelTopUserDto[];
}

/* */

class SubmissionUserRankDto {
	@ApiProperty({ example: 1 })
	submissionCount: number;

	@ApiProperty({ example: 1 })
	rank: number;
}

class SubmissionTopUserDto {
	@ApiProperty({ example: "ed1fec91-a425-4083-aa58-03ecc1b3419c" })
	userId: string;

	@ApiProperty({ example: 1 })
	submissionCount: number;

	@ApiProperty({ example: "gaumeodathanh" })
	username: string;

	@ApiProperty({ example: "Silver" })
	rankTitle: string;

	@ApiProperty({ example: null, nullable: true })
	avatarUrl: string | null;

	@ApiProperty({ example: "2025-04-28T01:47:37.676Z" })
	lastSubmissionTime: string; // ISO string for now

	@ApiProperty({ example: 1 })
	rank: number;
}

export class SubmissionLeaderboardResponseDto {
	@ApiProperty({ type: SubmissionUserRankDto })
	userRank: SubmissionUserRankDto;

	@ApiProperty({ type: [SubmissionTopUserDto] })
	topUsers: SubmissionTopUserDto[];
}
