import { Test, TestingModule } from '@nestjs/testing';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { ResponseService } from 'src/common/response/response.service';
import { Request, Response } from 'express';
import { InstructorDto } from './dto/instructor.dto';
import { MockInstructorRepository } from './instructor.service.spec';

class MockInstructorService {
  createInstructor = jest.fn();
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

describe('InstructorController', () => {
  let instructorController: InstructorController;
  let instructorService: MockInstructorService;
  let responseService: MockResponseService;

  const mockInstructor = new MockInstructorRepository().mockInstructor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorController],
      providers: [
        { provide: InstructorService, useClass: MockInstructorService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    instructorController =
      module.get<InstructorController>(InstructorController);
    instructorService = module.get<InstructorService, MockInstructorService>(
      InstructorService,
    );
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(instructorController).toBeDefined();
  });

  describe('createInstructor', () => {
    it('userType 지정 후 customer 정보 입력', async () => {
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
        body: { instructorDto: InstructorDto },
      };

      instructorService.createInstructor.mockResolvedValue(mockInstructor);

      await instructorController.createInstructor(req.body, res as Response);

      expect(instructorService.createInstructor).toHaveBeenCalledWith(
        res.locals.user.userId,
        req.body,
      );
      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강사 정보 입력 완료',
        mockInstructor,
      );
    });
  });
});
