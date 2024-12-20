import { Test, TestingModule } from '@nestjs/testing';
import { EmpruntsController } from './emprunts.controller';

describe('EmpruntsController', () => {
  let controller: EmpruntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpruntsController],
    }).compile();

    controller = module.get<EmpruntsController>(EmpruntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
