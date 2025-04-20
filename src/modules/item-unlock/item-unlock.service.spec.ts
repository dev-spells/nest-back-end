import { Test, TestingModule } from '@nestjs/testing';
import { ItemUnlockService } from './item-unlock.service';

describe('ItemUnlockService', () => {
  let service: ItemUnlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemUnlockService],
    }).compile();

    service = module.get<ItemUnlockService>(ItemUnlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
