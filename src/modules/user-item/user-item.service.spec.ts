import { Test, TestingModule } from '@nestjs/testing';
import { UserItemService } from './user-item.service';

describe('UserItemService', () => {
  let service: UserItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserItemService],
    }).compile();

    service = module.get<UserItemService>(UserItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
