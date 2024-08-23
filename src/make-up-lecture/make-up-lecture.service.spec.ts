import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpLectureService } from './make-up-lecture.service';

describe('MakeUpLectureService', () => {
  let service: MakeUpLectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MakeUpLectureService],
    }).compile();

    service = module.get<MakeUpLectureService>(MakeUpLectureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
