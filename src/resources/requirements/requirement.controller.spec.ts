import { Test, TestingModule } from '@nestjs/testing';
import { RequirementController } from './requirement.controller';
import { RequirementService } from './requirement.service';

describe('RequirementController', () => {
  let controller: RequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementController],
      providers: [RequirementController],
    }).compile();

    controller = module.get<RequirementController>(RequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
