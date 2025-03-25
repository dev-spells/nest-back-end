import * as bcrypt from "bcryptjs";

export async function validatePassword(
	plainPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(plainPassword: string): Promise<string> {
	return await bcrypt.hash(plainPassword, 10);
}
