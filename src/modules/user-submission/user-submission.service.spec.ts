import { Test, TestingModule } from '@nestjs/testing';
import { UserSubmissionService } from './user-submission.service';

describe('UserSubmissionService', () => {
  let service: UserSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSubmissionService],
    }).compile();

    service = module.get<UserSubmissionService>(UserSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
