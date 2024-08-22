import { Test, TestingModule } from '@nestjs/testing';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { ResponseService } from 'src/common/response/response.service';
import { MockLectureRepository } from './lecture.service.spec';
import { Request, response, Response } from 'express';
import { LectureDto } from './dto/lecture.dto';
import { UpdateLectureDto } from './dto/updateLecture.dto';

class MockLectureService {
  createLecture = jest.fn();
  findAllLecturesForSchedule = jest.fn();
  findLectureDetail = jest.fn();
  updateLecture = jest.fn();
  softDeleteLecture = jest.fn();
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

  const mockLecture = new MockLectureRepository().mockLecture;

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

  describe('createLecture', () => {
    it('새로운 강의를 생성하고 성공 response를 return', async () => {
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
        body: { lectureDto: LectureDto },
      };

      lectureService.createLecture.mockResolvedValue(mockLecture);

      await lectureController.createLecture(req.body, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강의 생성 성공',
        mockLecture,
      );
    });
  });

  describe('getAllLectures', () => {
    it('강의를 전체 조회하여 return', async () => {
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

      lectureService.findAllLecturesForSchedule.mockResolvedValue([
        mockLecture,
      ]);

      await lectureController.getAllLecturesForSchedule(res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '전체 강의 조회 성공',
        [mockLecture],
      );
    });
  });

  describe('getLectureDetail', () => {
    it('lectureId를 parameter로 받아 강의를 상세 조회하여 return', async () => {
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

      lectureService.findLectureDetail.mockResolvedValue(mockLecture);

      await lectureController.getLectureDetail(lectureId, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강의 상세 조회 성공',
        mockLecture,
      );
    });
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
        req.body.updateLectureDto,
        res as Response,
      );

      expect(lectureService.updateLecture).toHaveBeenCalledWith(
        res.locals.user.userId,
        lectureId,
        req.body.updateLectureDto,
      );
      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강의 수정 성공',
      );
    });
  });

  describe('softDeleteLecture', () => {
    it('lectureId를 parameter로 받아 해당 강의를 softDelete한다.', async () => {
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

      await lectureController.softDeleteLecture(lectureId, res as Response);

      expect(lectureService.softDeleteLecture).toHaveBeenCalledWith(
        res.locals.user.userId,
        lectureId,
      );
      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강의 삭제 성공',
      );
    });
  });
});
