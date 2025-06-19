import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Notification } from "src/entities/notification.entity";
import { User } from "src/entities/user.entity";

import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
	imports: [TypeOrmModule.forFeature([Notification, User])],
	controllers: [NotificationController],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
