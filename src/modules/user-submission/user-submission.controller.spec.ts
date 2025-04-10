import { Test, TestingModule } from '@nestjs/testing';
import { UserSubmissionController } from './user-submission.controller';
import { UserSubmissionService } from './user-submission.service';

describe('UserSubmissionController', () => {
  let controller: UserSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubmissionController],
      providers: [UserSubmissionService],
    }).compile();

    controller = module.get<UserSubmissionController>(UserSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
