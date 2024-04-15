import { Test, TestingModule } from '@nestjs/testing';
import { MsgUpdateController } from './msg-update.controller';

describe('MsgUpdateController', () => {
  let controller: MsgUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsgUpdateController],
    }).compile();

    controller = module.get<MsgUpdateController>(MsgUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
