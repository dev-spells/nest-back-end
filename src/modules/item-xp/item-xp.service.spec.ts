import { Test, TestingModule } from '@nestjs/testing';
import { ItemXpService } from './item-xp.service';

describe('ItemXpService', () => {
  let service: ItemXpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemXpService],
    }).compile();

    service = module.get<ItemXpService>(ItemXpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
