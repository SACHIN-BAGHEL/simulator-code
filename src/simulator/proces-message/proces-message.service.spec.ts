import { Test, TestingModule } from '@nestjs/testing';
import { ProcesMessageService } from './proces-message.service';

describe('ProcesMessageService', () => {
  let service: ProcesMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcesMessageService],
    }).compile();

    service = module.get<ProcesMessageService>(ProcesMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
