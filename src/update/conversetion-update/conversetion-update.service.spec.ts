import { Test, TestingModule } from '@nestjs/testing';
import { ConversetionUpdateService } from './conversetion-update.service';

describe('ConversetionUpdateService', () => {
  let service: ConversetionUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversetionUpdateService],
    }).compile();

    service = module.get<ConversetionUpdateService>(ConversetionUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
