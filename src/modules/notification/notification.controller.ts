import {
	Controller,
	MessageEvent,
	Param,
	Post,
	Sse,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, Subscriber } from "rxjs";

import { ApiOperation } from "@nestjs/swagger";

import { TOKEN_ERRORS } from "src/constants/errors";
import { Public } from "src/decorators/public-route";
import { extractJwtPayload } from "src/utils/extract-access-token.util";

import { NotificationService } from "./notification.service";
import { ObserverStore } from "./notification-observer.store";

@Controller("notification")
export class NotificationController {
	constructor(
		private readonly notificationService: NotificationService,
		private readonly configService: ConfigService,
	) {}

	@ApiOperation({ summary: "Connect to sse stream notifications" })
	@Public()
	@Sse("sse/:token")
	sse(@Param("token") token: string): Observable<MessageEvent> {
		const secret = this.configService.get("JWT_SECRET");
		const user = extractJwtPayload(token, secret);
		if (!user) {
			throw new UnauthorizedException(TOKEN_ERRORS.INVALID_ACCESS_TOKEN);
		}

		return new Observable((subscriber: Subscriber<MessageEvent>) => {
			console.log(`User ${user.id} connected to SSE`);
			ObserverStore.add(user.id, subscriber);
			ObserverStore.push(user.id, {
				data: "hello world",
			});

			const heartbeatInterval = setInterval(() => {
				ObserverStore.push(user.id, {
					type: "heartbeat",
					timestamp: Date.now(),
				});
			}, 25000);
			subscriber.add(() => {
				clearInterval(heartbeatInterval);
				ObserverStore.remove(user.id);
				console.log(`User ${user.id} disconnected from SSE`);
			});
		});
	}

	@Public()
	@Post(":id")
	push(@Param("id") id: string) {
		this.notificationService.pushToUser(id, {
			type: "notification",
			data: "hello world",
		});
	}
}
