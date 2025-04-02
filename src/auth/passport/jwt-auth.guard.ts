import {
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { TOKEN_ERRORS } from "src/constants/errors";
import { Role } from "src/constants/role.enum";
import { IS_PUBLIC_KEY } from "src/decorators/public-route";
import { ROLE } from "src/decorators/role-route";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const requiresAuth = request.query?.fav === "true";

		if (isPublic && !requiresAuth) {
			return true;
		}

		// Active to get the req.user for role checking
		const canActivate = await super.canActivate(context);
		if (!canActivate) {
			return false;
		}

		const { user } = context.switchToHttp().getRequest();

		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE, [
			context.getHandler(),
			context.getClass(),
		]);

		if (
			requiredRoles &&
			!requiredRoles.some(role => user?.role?.includes(role))
		) {
			throw new ForbiddenException(TOKEN_ERRORS.PERMISSION_DENIED);
		}

		return true;
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			throw err || new UnauthorizedException(TOKEN_ERRORS.INVALID_ACCESS_TOKEN);
		}
		return user;
	}
}
