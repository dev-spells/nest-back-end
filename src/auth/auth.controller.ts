import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Request,
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/decorators/public-route";
import {
	ApiBearerAuth,
	ApiBody,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiProperty,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { LocalAuthGuard } from "./passport/local-auth.guard";
import { IsString, MinLength } from "class-validator";
import { RefreshAuthGuard } from "./passport/refresh-auth.guard";

class LoginDto {
	@IsString()
	@ApiProperty()
	username: string;
	@IsString()
	@MinLength(1)
	@ApiProperty()
	password: string;
}

@ApiTags("Authenticate")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@ApiBody({ type: LoginDto })
	@Public()
	@UseGuards(LocalAuthGuard)
	handleLogin(@Request() req) {
		return req.user;
	}

	@ApiOperation({ summary: "refresh access token" })
	@ApiBearerAuth()
	@ApiResponse({ status: 201, description: "Successful operation" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	@Public()
	@UseGuards(RefreshAuthGuard)
	@Get("refresh")
	@HttpCode(HttpStatus.CREATED)
	handleRefreshToken(@Req() req) {
		return this.authService.refreshAccessToken(req.user);
	}
}
