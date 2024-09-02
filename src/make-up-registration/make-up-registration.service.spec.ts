import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpRegistrationService } from './make-up-registration.service';

describe('MakeUpRegistrationService', () => {
  let service: MakeUpRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MakeUpRegistrationService],
    }).compile();

    service = module.get<MakeUpRegistrationService>(MakeUpRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
