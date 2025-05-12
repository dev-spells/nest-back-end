export const NOTIFY_TYPE = {
	USE_PROTECT_DAILY_STREAK: {
		type: "use_protect_daily_streak",
		message: `You have used the daily streak protection item`,
	},
	FINISH_COURSE: {
		type: "finish_course",
		message: (courseName: string) =>
			`You have finished the course ${courseName}`,
	},
	DAILY_STREAK: {
		type: "daily_streak",
		message: "You have achieved new badge for daily streak",
	},
	LESSON_ACHIEVEMENT: {
		type: "lesson_achievement",
		message: `You have achieved new badge for lesson`,
	},
	CORRECT_STREAK: {
		type: "correct_streak",
		message: "You have achieved new badge for correct streak",
	},
	SERVER_NOTIFY: {
		type: "server_notify",
		message: message => message,
	},
	UNLOCK_WHEEL: {
		type: "unlock_wheel",
		message: "You have unlocked the wheel",
	},
	DAILY_WHEEL: {
		type: "daily_wheel",
		message: "Your daily wheel spin is begin, good luck!",
	},
};
