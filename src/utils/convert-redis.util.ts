export interface RedisMapData {
	[key: string]: number[];
}

export function convertToMapData(
	rawData: Record<string, string>,
): RedisMapData {
	const data: RedisMapData = {};

	for (const [key, value] of Object.entries(rawData || {})) {
		try {
			data[key] = JSON.parse(value) || [];
		} catch {
			data[key] = [];
		}
	}

	return data;
}

export function parseToRedisData(data: RedisMapData): Record<string, string> {
	return Object.entries(data).reduce<Record<string, string>>(
		(acc, [key, value]) => {
			acc[key] = JSON.stringify(value);
			return acc;
		},
		{},
	);
}
