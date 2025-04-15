import { Controller } from '@nestjs/common';
import { ItemProtectStreakService } from './item-protect-streak.service';

@Controller('item-protect-streak')
export class ItemProtectStreakController {
  constructor(private readonly itemProtectStreakService: ItemProtectStreakService) {}
}
