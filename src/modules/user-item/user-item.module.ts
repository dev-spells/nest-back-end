import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { UserItemController } from './user-item.controller';

@Module({
  controllers: [UserItemController],
  providers: [UserItemService],
})
export class UserItemModule {}
