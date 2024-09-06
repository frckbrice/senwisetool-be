import { Test, TestingModule } from '@nestjs/testing';
import { ComapnyService } from './companies.service';

describe('CompaniesService', () => {
  let service: ComapnyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComapnyService],
    }).compile();

    service = module.get<ComapnyService>(ComapnyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
