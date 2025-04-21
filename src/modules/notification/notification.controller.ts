import { Controller, Get, MessageEvent, Param, Sse } from "@nestjs/common";
import { Observable, Subscriber } from "rxjs";

import { Public } from "src/decorators/public-route";

import { NotificationService } from "./notification.service";
import { ObserverStore } from "./notification-observer.store";

@Controller("notification")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Public()
	@Sse(":id")
	sse(@Param("id") id: string): Observable<MessageEvent> {
		return new Observable((subscriber: Subscriber<MessageEvent>) => {
			console.log(`User ${id} connected to SSE`);
			ObserverStore.add(id, subscriber);
			ObserverStore.push(id, {
				data: "hello world",
			});
			// subscriber.next({
			// 	data: `Connected to notification stream for user ${id}`,
			// });

			// Clean up on disconnect
			subscriber.add(() => {
				ObserverStore.remove(id);
				console.log(`User ${id} disconnected from SSE`);
			});
		});
	}

	@Public()
	@Get()
	getAll() {
		this.notificationService.pushToUser(
			"ed1fec91-a425-4083-aa58-03ecc1b3419c",
			{
				type: "notification",
				data: "hello world",
			},
		);
	}
}
