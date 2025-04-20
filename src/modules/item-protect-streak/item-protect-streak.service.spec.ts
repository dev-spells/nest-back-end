import { Test, TestingModule } from '@nestjs/testing';
import { ItemProtectStreakService } from './item-protect-streak.service';

describe('ItemProtectStreakService', () => {
  let service: ItemProtectStreakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemProtectStreakService],
    }).compile();

    service = module.get<ItemProtectStreakService>(ItemProtectStreakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
