import jwt from "jsonwebtoken";

export function extractJwtPayload(token: string) {
	try {
		return jwt.decode(token);
	} catch {
		return null;
	}
}
