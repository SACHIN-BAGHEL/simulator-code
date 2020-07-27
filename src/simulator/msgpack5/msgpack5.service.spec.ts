import { Test, TestingModule } from '@nestjs/testing';
import { Msgpack5Service } from './msgpack5.service';

describe('Msgpack5Service', () => {
  let service: Msgpack5Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Msgpack5Service],
    }).compile();

    service = module.get<Msgpack5Service>(Msgpack5Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
