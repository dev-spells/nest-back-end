import { MessageEvent } from "@nestjs/common";
import { Subscriber } from "rxjs";

export class ObserverStore {
	private static observers: Map<string, Subscriber<MessageEvent>> = new Map();

	static add(userId: string, subscriber: Subscriber<MessageEvent>) {
		if (this.observers.has(userId)) {
			return;
		}
		this.observers.set(userId, subscriber);
	}

	static remove(userId: string) {
		this.observers.delete(userId);
	}

	static push(userId: string, data: any) {
		const subscriber = this.observers.get(userId);
		if (subscriber) {
			subscriber.next({ data });
		}
	}

	static pushAll(data: any) {
		this.observers.forEach(subscriber => {
			subscriber.next({ data });
		});
	}

	static has(userId: string): boolean {
		return this.observers.has(userId);
	}
}
