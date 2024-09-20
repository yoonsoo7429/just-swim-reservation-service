import { Test, TestingModule } from '@nestjs/testing';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { ResponseService } from 'src/common/response/response.service';
import { Request, Response } from 'express';
import { UpdateLectureDto } from './dto/update-lecture.dto';

class MockLectureService {
  createLecturesForMember = jest.fn();
  deleteLecturesForMember = jest.fn();
  createLecturesForNextMonth = jest.fn();
  updateLecture = jest.fn();
  expirePastLectures = jest.fn();
}

class MockResponseService {
  success = jest.fn();
  error = jest.fn();
  unauthorized = jest.fn();
  notFound = jest.fn();
  conflict = jest.fn();
  forbidden = jest.fn();
  internalServerError = jest.fn();
}

describe('LectureController', () => {
  let lectureController: LectureController;
  let lectureService: MockLectureService;
  let responseService: MockResponseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [
        { provide: LectureService, useClass: MockLectureService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    lectureController = module.get<LectureController>(LectureController);
    lectureService = module.get<LectureService, MockLectureService>(
      LectureService,
    );
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(lectureController).toBeDefined();
  });

  describe('updateLecture', () => {
    it('lectureId를 parameter로 받고 body로 UpdateLectureDto를 받아 강의를 수정한다.', async () => {
      const lectureId = 1;

      const res: Partial<Response> = {
        locals: {
          user: {
            userId: 1,
            userType: 'instructor',
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const req: Partial<Request> = {
        body: { updateLectureDto: UpdateLectureDto },
      };

      await lectureController.updateLecture(
        lectureId,
        req.body,
        res as Response,
      );

      expect(lectureService.updateLecture).toHaveBeenCalledWith(
        res.locals.user.userId,
        res.locals.user.userType,
        lectureId,
        req.body,
      );
      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강의 업데이트 성공',
      );
    });
  });
});
