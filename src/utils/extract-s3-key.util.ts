export function extractS3Key(url: string) {
	return url.split(".com/")[1];
}
