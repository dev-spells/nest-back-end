import { Controller } from '@nestjs/common';
import { UserItemService } from './user-item.service';

@Controller('user-item')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}
}
