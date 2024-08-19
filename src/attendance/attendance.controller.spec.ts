import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Request, Response } from 'express';
import { AttendanceDto } from './dto/attendance.dto';
import { ResponseService } from 'src/common/response/response.service';

class MockAttendanceService {
  createAttendance = jest.fn();
  deleteAttendance = jest.fn();
  getAttendanceCount = jest.fn();
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

describe('AttendanceController', () => {
  let attendanceController: AttendanceController;
  let attendanceService: MockAttendanceService;
  let responseService: MockResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceService, useClass: MockAttendanceService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    attendanceController =
      module.get<AttendanceController>(AttendanceController);
    attendanceService = module.get<AttendanceService, MockAttendanceService>(
      AttendanceService,
    );
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(attendanceController).toBeDefined();
  });

  describe('createAttendance', () => {
    it('출결 체크를 하고 response를 return', async () => {
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
        body: { attendanceDto: AttendanceDto },
      };

      attendanceService.createAttendance.mockResolvedValue(undefined);

      await attendanceController.createAttendance(req.body, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '출석 체크 성공',
      );
    });
  });

  describe('deleteAttendance', () => {
    it('출결 취소를 하고 response를 return', async () => {
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
        body: { attendanceDto: AttendanceDto },
      };

      attendanceService.deleteAttendance.mockResolvedValue(undefined);

      await attendanceController.deleteAttendance(req.body, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '출석 취소 성공',
      );
    });
  });
});
