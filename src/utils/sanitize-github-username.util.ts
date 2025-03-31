export function sanitizeGithubUsername(username: string) {
	if (!username) return username;
	if (username.endsWith("_gh")) {
		username = username.slice(0, -3);
	}
	return username;
}
