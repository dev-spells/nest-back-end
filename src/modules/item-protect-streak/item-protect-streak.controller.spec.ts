import { Test, TestingModule } from '@nestjs/testing';
import { ItemProtectStreakController } from './item-protect-streak.controller';
import { ItemProtectStreakService } from './item-protect-streak.service';

describe('ItemProtectStreakController', () => {
  let controller: ItemProtectStreakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemProtectStreakController],
      providers: [ItemProtectStreakService],
    }).compile();

    controller = module.get<ItemProtectStreakController>(ItemProtectStreakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
