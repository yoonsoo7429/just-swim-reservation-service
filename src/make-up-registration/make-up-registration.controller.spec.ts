import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpRegistrationController } from './make-up-registration.controller';

describe('MakeUpRegistrationController', () => {
  let controller: MakeUpRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeUpRegistrationController],
    }).compile();

    controller = module.get<MakeUpRegistrationController>(
      MakeUpRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
