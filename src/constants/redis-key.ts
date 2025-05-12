export const RedisKey = {
	userItemUnlock: (userId: string) => `user:${userId}:item-unlock`,
	userItemXP: (userId: string) => `user:${userId}:item-xp`,
	userItemDailyStreak: (userId: string) => `user:${userId}:item-daily-streak`,
	verifyEmail: (email: string) => `verification:${email}`,
	forgotPassword: (email: string) => `forgot-password:${email}`,
	resetPassword: (email: string) => `password-reset:${email}`,
	userFreeSolution: (userId: string) => `user:${userId}:free-solution`,
	topDailySubmission: "top-daily-submission",
	userTopLevel: "top-level",
	userGithubProgress: (userId: string) => `user:${userId}:github-progress`,
	analytic: "analytic",
	wheel: "wheel",
};
