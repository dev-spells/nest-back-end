import { Test, TestingModule } from '@nestjs/testing';
import { ItemUnlockController } from './item-unlock.controller';
import { ItemUnlockService } from './item-unlock.service';

describe('ItemUnlockController', () => {
  let controller: ItemUnlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemUnlockController],
      providers: [ItemUnlockService],
    }).compile();

    controller = module.get<ItemUnlockController>(ItemUnlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
