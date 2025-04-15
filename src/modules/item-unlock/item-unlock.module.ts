import { Module } from "@nestjs/common";

import { ItemUnlockController } from "./item-unlock.controller";
import { ItemUnlockService } from "./item-unlock.service";

@Module({
	controllers: [ItemUnlockController],
	providers: [ItemUnlockService],
})
export class ItemUnlockModule {}
