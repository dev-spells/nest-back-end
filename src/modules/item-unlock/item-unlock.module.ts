import { Module } from '@nestjs/common';
import { ItemUnlockService } from './item-unlock.service';
import { ItemUnlockController } from './item-unlock.controller';

@Module({
  controllers: [ItemUnlockController],
  providers: [ItemUnlockService],
})
export class ItemUnlockModule {}
