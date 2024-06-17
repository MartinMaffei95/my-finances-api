import { Test, TestingModule } from '@nestjs/testing';
import { DebtorsController } from './debtors.controller';
import { DebtorsService } from './debtors.service';

describe('DebtorsController', () => {
  let controller: DebtorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtorsController],
      providers: [DebtorsService],
    }).compile();

    controller = module.get<DebtorsController>(DebtorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
