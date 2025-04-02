import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { TOKEN_ERRORS } from "src/constants/errors";

@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh-jwt") {
	canActivate(context: ExecutionContext) {
		// Add your custom authentication logic here
		// for example, call super.logIn(request) to establish a session.
		return super.canActivate(context);
	}

	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw (
				err || new UnauthorizedException(TOKEN_ERRORS.INVALID_REFRESH_TOKEN)
			);
		}
		return user;
	}
}
