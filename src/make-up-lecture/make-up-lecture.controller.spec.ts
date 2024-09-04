import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpLectureController } from './make-up-lecture.controller';
import { MockMakeUpLectureRepository } from './make-up-lecture.service.spec';
import { MakeUpLectureService } from './make-up-lecture.service';
import { ResponseService } from 'src/common/response/response.service';
import { MakeUpLectureDto } from './dto/make-up-lecture.dto';
import { Request, Response } from 'express';

class MockMakeUpLectureService {
  createMakeUpLecture = jest.fn();
  findMakeUpLecturesByLectureId = jest.fn();
  deleteMakeUpLecture = jest.fn();
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

describe('MakeUpLectureController', () => {
  let makeUpLectureController: MakeUpLectureController;
  let makeUpLectureService: MockMakeUpLectureService;
  let responseService: MockResponseService;

  const mockMakeUpLecture = new MockMakeUpLectureRepository().mockMakeUpLecture;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeUpLectureController],
      providers: [
        { provide: MakeUpLectureService, useClass: MockMakeUpLectureService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    makeUpLectureController = module.get<MakeUpLectureController>(
      MakeUpLectureController,
    );
    makeUpLectureService = module.get<
      MakeUpLectureService,
      MockMakeUpLectureService
    >(MakeUpLectureService);
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(makeUpLectureController).toBeDefined();
  });

  describe('createMakeUpLecture', () => {
    it('makeUpLectureDto에 맞게 등록하고 response를 return', async () => {
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
        body: { makeUpLectureDto: MakeUpLectureDto },
      };

      makeUpLectureService.createMakeUpLecture.mockResolvedValue(
        mockMakeUpLecture,
      );

      await makeUpLectureController.createMakeUpLecture(
        req.body,
        res as Response,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '보강 오픈 성공',
      );
    });
  });

  describe('getMakeUpLecturesByLectureId', () => {
    it('보강 가능 날짜를 return', async () => {
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

      const lectureId = 1;

      makeUpLectureService.findMakeUpLecturesByLectureId.mockResolvedValue([
        mockMakeUpLecture,
      ]);

      await makeUpLectureController.getMakeUpLecturesByLectureId(
        lectureId,
        res as Response,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '보강 조회 성공',
        [mockMakeUpLecture],
      );
    });
  });

  describe('deleteMakeUpLecture', () => {
    it('instructor가 등록한 보강 날짜 취소하고 response를 return', async () => {
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

      const lectureId = 1;
      const makeUpLectureDay = '2023-09-04';
      const makeUpLectureStartTime = '10:00';

      makeUpLectureService.deleteMakeUpLecture.mockResolvedValue(undefined);

      await makeUpLectureController.deleteMakeUpLecture(
        lectureId,
        makeUpLectureDay,
        makeUpLectureStartTime,
        res as Response,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '보강 취소 성공',
      );
    });
  });
});
