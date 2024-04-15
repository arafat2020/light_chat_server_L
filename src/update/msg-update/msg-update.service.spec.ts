import { Test, TestingModule } from '@nestjs/testing';
import { MsgUpdateService } from './msg-update.service';

describe('MsgUpdateService', () => {
  let service: MsgUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsgUpdateService],
    }).compile();

    service = module.get<MsgUpdateService>(MsgUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
