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
};
