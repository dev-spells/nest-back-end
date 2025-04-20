import { DIFFICULTY_REWARDS, LEVELS, RANKS } from "src/constants/level";

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

export function generateRandomRewards(
	difficulty: "EASY" | "MEDIUM" | "HARD",
	bonus: number = 0,
) {
	const { exp, gems } = DIFFICULTY_REWARDS[difficulty];

	const getRandomValue = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const expGained = getRandomValue(exp.min, exp.max);
	const expBonus = Math.ceil(expGained * ((bonus || 0) / 100));
	return {
		expGained,
		expBonus,
		gemsGained: getRandomValue(gems.min, gems.max),
	};
}

export function calculateLevel(
	curExp: number,
	curLevel: number,
	expGained: number,
) {
	let totalExp = curExp + expGained;
	let newLevel = curLevel;

	while (totalExp >= LEVELS[newLevel - 1]?.expToLevelUp) {
		const expToLevelUp = LEVELS[newLevel - 1]?.expToLevelUp;
		totalExp -= expToLevelUp;
		newLevel++;
	}

	const RankName = getRankNameForLevel(newLevel);
	const Border = getBorderForLevel(newLevel);

	return {
		levelUp: newLevel > curLevel ? true : false,
		curLevel: newLevel,
		expToLevelUp: LEVELS[newLevel - 1]?.expToLevelUp,
		curExp: totalExp,
		rankTitle: RankName,
		rankBorder: Border,
	};
}
