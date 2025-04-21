import * as jwt from "jsonwebtoken";

export function extractJwtPayload(token: string, secret: string) {
	try {
		return jwt.verify(token, secret) as { id: string; role: string };
	} catch {
		return null;
	}
}
