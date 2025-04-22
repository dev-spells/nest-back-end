import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Notification } from "src/entities/notification.entity";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationResponse } from "./dto/response-notification.dto";
import { ObserverStore } from "./notification-observer.store";

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
	) {}
	async pushToUser(
		userId: string,
		createNotificationDto: CreateNotificationDto,
	) {
		await this.notificationRepository.save({
			userId: userId,
			...createNotificationDto,
		});

		ObserverStore.push(userId, createNotificationDto);
	}

	async pushToUsers(
		userIds: string[],
		createNotificationDto: CreateNotificationDto,
	) {
		if (userIds.length === 0) return;
		console.log("update to users", userIds);
		await this.notificationRepository.save(
			userIds.map(userId => ({
				userId: userId,
				...createNotificationDto,
			})),
		);

		userIds.forEach(userId => {
			ObserverStore.push(userId, createNotificationDto);
		});
	}

	async markAsRead(userId: string) {
		await this.notificationRepository.update(
			{ userId: userId },
			{ isRead: true },
		);
	}

	async getAll(userId: string) {
		return (await this.notificationRepository.find({
			select: {
				id: true,
				userId: true,
				type: true,
				message: true,
				isRead: true,
				createdAt: true,
				item: {
					id: true,
					name: true,
					imageUrl: true,
				},
				course: {
					id: true,
					title: true,
					iconUrl: true,
				},
			},
			where: { userId: userId },
			order: { createdAt: "DESC" },
			relations: {
				course: true,
				item: true,
			},
		})) as NotificationResponse[];
	}
}
