import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpLectureController } from './make-up-lecture.controller';

describe('MakeUpLectureController', () => {
  let controller: MakeUpLectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeUpLectureController],
    }).compile();

    controller = module.get<MakeUpLectureController>(MakeUpLectureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
