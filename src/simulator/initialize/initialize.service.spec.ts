import { Test, TestingModule } from '@nestjs/testing';
import { InitializeService } from './initialize.service';

describe('InitializeService', () => {
  let service: InitializeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializeService],
    }).compile();

    service = module.get<InitializeService>(InitializeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
