export const RedisKey = {
	userItemUnlock: (userId: string) => `user:${userId}:item-unlock`,
	userItemXP: (userId: string) => `user:${userId}:item-xp`,
	verifyEmail: (email: string) => `verification:${email}`,
	forgotPassword: (email: string) => `forgot-password:${email}`,
	resetPassword: (email: string) => `password-reset:${email}`,
};
