export type AchievementType =
	| "NUMBER_OF_LESSONS"
	| "DAILY_STREAK"
	| "CORRECT_STREAK";

export interface AchievementLevel {
	level: number;
	threshold: number;
	name: string;
}

export const ACHIEVEMENTS = {
	NUMBER_OF_LESSONS: {
		type: "lesson_achievement",
		levels: [
			{ threshold: 10, name: "Lesson Novice" },
			{ threshold: 30, name: "Lesson Explorer" },
			{ threshold: 60, name: "Lesson Adept" },
			{ threshold: 100, name: "Lesson Master" },
			{ threshold: 200, name: "Lesson Legend" },
			{ threshold: 350, name: "Lesson Sage" },
			{ threshold: 500, name: "Lesson Mythic" },
		],
	},
	DAILY_STREAK: {
		type: "streak_achievement",
		levels: [
			{ threshold: 5, name: "Streak Initiate" },
			{ threshold: 14, name: "Streak Keeper" },
			{ threshold: 30, name: "Streak Enthusiast" },
			{ threshold: 60, name: "Streak Champion" },
			{ threshold: 120, name: "Streak Immortal" },
			{ threshold: 200, name: "Streak Eternal" },
			{ threshold: 300, name: "Streak Timeless" },
		],
	},
	CORRECT_STREAK: {
		type: "accuracy_achievement",
		levels: [
			{ threshold: 10, name: "Accuracy Beginner" },
			{ threshold: 30, name: "Accuracy Skilled" },
			{ threshold: 60, name: "Accuracy Expert" },
			{ threshold: 100, name: "Accuracy Pro" },
			{ threshold: 200, name: "Accuracy Perfectionist" },
			{ threshold: 350, name: "Accuracy Virtuoso" },
			{ threshold: 500, name: "Accuracy Flawless" },
		],
	},
};
