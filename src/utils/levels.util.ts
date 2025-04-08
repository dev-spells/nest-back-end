import { DIFFICULTY_EXP_RANGES, LEVELS, RANKS } from "src/constants/level";

export function getRankForLevel(level: number) {
	const rank = RANKS.find(r => level >= r.levels[0] && level <= r.levels[1]);
	return rank ? { name: rank.name, border: rank.border } : null;
}

export function getRankNameForLevel(level: number) {
	const rank = getRankForLevel(level);
	return rank?.name ?? "";
}

export function getBorderForLevel(level: number) {
	const rank = getRankForLevel(level);
	return rank?.border ?? "";
}

export function generateRandomExp(
	difficulty: "EASY" | "MEDIUM" | "HARD",
): number {
	const { min, max } = DIFFICULTY_EXP_RANGES[difficulty];
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateLevel(
	curExp: number,
	curLevel: number,
	expGained: number,
) {
	let totalExp = curExp + expGained;
	let newLevel = curLevel;

	// Loop to calculate the new level based on the experience thresholds
	while (newLevel < LEVELS.length) {
		const expToLevelUp = LEVELS[newLevel - 1]?.expToLevelUp;

		if (totalExp >= expToLevelUp) {
			totalExp -= expToLevelUp;
			newLevel++;
		} else {
			break;
		}
	}

	const RankName = getRankNameForLevel(newLevel);
	const Border = getBorderForLevel(newLevel);

	return {
		curLevel: newLevel,
		expToLevelUp: LEVELS[newLevel - 1]?.expToLevelUp,
		curExp: totalExp,
		rankTitle: RankName,
		rankBorder: Border,
	};
}
