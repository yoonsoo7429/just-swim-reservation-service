import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpRegistrationController } from './make-up-registration.controller';
import { ResponseService } from 'src/common/response/response.service';
import { MockMakeUpRegistrationRepository } from './make-up-registration.service.spec';
import { MakeUpRegistrationService } from './make-up-registration.service';
import { Response } from 'express';
import { DeleteResult } from 'typeorm';

class MockMakeUpRegistrationService {
  createMakeUpRegistration = jest.fn();
  deleteMakeUpRegistration = jest.fn();
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

describe('MakeUpRegistrationController', () => {
  let makeUpRegistrationController: MakeUpRegistrationController;
  let makeUpRegistrationService: MockMakeUpRegistrationService;
  let responseService: MockResponseService;

  const mockMakeUpRegistration = new MockMakeUpRegistrationRepository()
    .mockMakeUpRegistration;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeUpRegistrationController],
      providers: [
        {
          provide: MakeUpRegistrationService,
          useClass: MockMakeUpRegistrationService,
        },
        {
          provide: ResponseService,
          useClass: MockResponseService,
        },
      ],
    }).compile();

    makeUpRegistrationController = module.get<MakeUpRegistrationController>(
      MakeUpRegistrationController,
    );
    makeUpRegistrationService = module.get<
      MakeUpRegistrationService,
      MockMakeUpRegistrationService
    >(MakeUpRegistrationService);
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(makeUpRegistrationController).toBeDefined();
  });

  describe('createMakeUpRegistration', () => {
    it('customer가 보충강습을 신청하고 예약 내용을 return', async () => {
      const res: Partial<Response> = {
        locals: {
          user: {
            userId: 2,
            userType: 'customer',
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const makeUpLectureId = 1;

      makeUpRegistrationService.createMakeUpRegistration.mockResolvedValue(
        mockMakeUpRegistration,
      );

      await makeUpRegistrationController.createMakeUpRegistration(
        res as Response,
        makeUpLectureId,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '보강 예약 신청 성공',
        mockMakeUpRegistration,
      );
    });
  });

  describe('deleteMakeUpRegistration', () => {
    it('customer가 예약한 보충 강습을 취소', async () => {
      const res: Partial<Response> = {
        locals: {
          user: {
            userId: 2,
            userType: 'customer',
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const makeUpLectureId = 1;

      makeUpRegistrationService.deleteMakeUpRegistration.mockResolvedValue(
        DeleteResult,
      );

      await makeUpRegistrationController.deleteMakeUpRegistration(
        res as Response,
        makeUpLectureId,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '보강 예약 취소 성공',
      );
    });
  });
});
