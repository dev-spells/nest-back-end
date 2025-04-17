import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Shop } from "src/entities/shop.entity";
import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";

import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";

@Module({
	imports: [TypeOrmModule.forFeature([Shop, UserItem, User])],
	controllers: [ShopController],
	providers: [ShopService],
})
export class ShopModule {}
