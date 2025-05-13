export const USER_ERRORS = {
	NOT_FOUND: "User not found",
	EMAIL_IN_USE: "Email already in use",
	USERNAME_IN_USE: "Username already in use",
	INVALID_CREDENTIALS: "Invalid credentials",
	UNVERIFIED_ACCOUNT: "Account not verified",
	EMAIL_VERIFIED: "Email already verified",
	INVALID_OTP: "Invalid OTP or expired",
	SPAM_OTP: "Please wait before requesting a new OTP",
	INVALID_OLD_PASSWORD: "Old password is incorrect",
	LOGIN_FAILED: "Username/Password incorrect",
	USER_COURSE_COMPLETED_NOT_FOUND: "User course completed not found",
} as const;

export const PASSWORD_ERRORS = {
	MIN_LENGTH: "Password must be at least 8 characters long",
	SPECIAL_CHAR: "Password must contain at least one special character",
} as const;

export const TOKEN_ERRORS = {
	INVALID_REFRESH_TOKEN: "Invalid refresh token",
	INVALID_ACCESS_TOKEN: "Invalid access token",
	INVALID_RESET_TOKEN: "Invalid or expired reset token",
	PERMISSION_DENIED: "Permission denied",
} as const;

export const EXERCISE_ERRORS = {
	NOT_FOUND: "Exercise not found",
	SNIPPET_NOT_FOUND: "Snippet not found",
	INVALID_ANSWER: "Answer must be one of the provided options",
} as const;

export const LESSON_ERRORS = {
	NOT_FOUND: "Lesson not found",
	INVALID_EXERCISE: "Invalid exercise data",
	MORE_THAN_ONE_EXERCISE: "Only one exercise type must be provided",
	ALREADY_SUBMITTED: "User has already submitted this lesson",
} as const;

export const COURSE_ERRORS = {
	NOT_FOUND: "Course not found",
	ALREADY_EXISTS: "Course with this title already exists",
	ALREADY_FINISH: "User already finished this course",
} as const;

export const ITEM_ERRORS = {
	NOT_FOUND: "Item not found",
	ALREADY_EXISTS: "Item with this title already exists",
	ALREADY_OWNED: "You already own this item",
	NOT_OWNED: "You don't own this item",
	ALREADY_IN_USE: "Item is already in use",
	ALREADY_FINISH: "User already finished this chapter",
} as const;

export const SHOP_ERRORS = {
	NOT_FOUND: "Item not found in shop",
	ALREADY_EXISTS: "Item already exists in shop",
	NOT_ENOUGH_MONEY: "Not enough money to buy this item",
	NOT_ENOUGH_ITEM: "Not enough quantity of item",
} as const;

export const WHEEL_ERRORS = {
	NOT_FOUND: "Wheel item not found",
	ITEM_ALREADY_EXISTS: "Wheel item already exists",
	INVALID_REWARD_TYPE: "Invalid reward type",
} as const;
