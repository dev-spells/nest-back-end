export const localDate = utcDate =>
	new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
