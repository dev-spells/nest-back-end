import { Module } from '@nestjs/common';
import { ItemProtectStreakService } from './item-protect-streak.service';
import { ItemProtectStreakController } from './item-protect-streak.controller';

@Module({
  controllers: [ItemProtectStreakController],
  providers: [ItemProtectStreakService],
})
export class ItemProtectStreakModule {}
