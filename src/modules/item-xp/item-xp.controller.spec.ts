import { Test, TestingModule } from '@nestjs/testing';
import { ItemXpController } from './item-xp.controller';
import { ItemXpService } from './item-xp.service';

describe('ItemXpController', () => {
  let controller: ItemXpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemXpController],
      providers: [ItemXpService],
    }).compile();

    controller = module.get<ItemXpController>(ItemXpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
