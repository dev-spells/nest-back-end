import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";

import { RedisModule } from "../cache/cache.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User]), RedisModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
