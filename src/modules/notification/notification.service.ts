import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Notification } from "src/entities/notification.entity";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { ObserverStore } from "./notification-observer.store";

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
	) {}
	pushToUser(userId: string, createNotificationDto: CreateNotificationDto) {
		ObserverStore.push(userId, createNotificationDto);
	}
}
