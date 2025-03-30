export const MailTemplates = {
	USER_CONFIRMATION: {
		templatePath: "./registerOtp",
		subject: "Email confirmation",
	},
	FORGOT_PASSWORD: {
		templatePath: "./forgotOtp",
		subject: "Reset your password",
	},
} as const;
