import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { RedisModule } from "../cache/cache.module";
import { MailModule } from "../mail/mail.module";

@Module({
	imports: [TypeOrmModule.forFeature([User]), RedisModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
