import {
	Controller,
	Get,
	MessageEvent,
	Param,
	Post,
	Query,
	Sse,
} from "@nestjs/common";
import { Observable, Subscriber } from "rxjs";

import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { Public } from "src/decorators/public-route";
import { extractJwtPayload } from "src/utils/extract-access-token.util";

import { NotificationService } from "./notification.service";
import { ObserverStore } from "./notification-observer.store";

@Controller("notification")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@ApiOperation({ summary: "Connect to sse stream notifications" })
	@ApiBearerAuth()
	@Sse("sse")
	sse(@Query("token") token: string): Observable<MessageEvent> {
		const user = extractJwtPayload(token);

		return new Observable((subscriber: Subscriber<MessageEvent>) => {
			console.log(`User ${user.id} connected to SSE`);
			ObserverStore.add(user.id, subscriber);
			ObserverStore.push(user.id, {
				data: "hello world",
			});

			subscriber.add(() => {
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
