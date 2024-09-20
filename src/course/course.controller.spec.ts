import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { ResponseService } from 'src/common/response/response.service';
import { CourseService } from './course.service';
import { Request, Response } from 'express';
import { CourseDto } from './dto/course.dto';
import { MockCourseRepository } from './course.service.spec';

class MockCourseService {
  createCourse = jest.fn();
  findAllCourses = jest.fn();
  findCourseDetail = jest.fn();
  findAllCoursesForSchedule = jest.fn();
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

describe('CourseController', () => {
  let courseController: CourseController;
  let courseService: MockCourseService;
  let responseService: MockResponseService;

  const mockCourse = new MockCourseRepository().mockCourse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        { provide: CourseService, useClass: MockCourseService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    courseController = module.get<CourseController>(CourseController);
    courseService = module.get<CourseService, MockCourseService>(CourseService);
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(courseController).toBeDefined();
  });

  describe('getAllCourses', () => {
    it('instructor가 강좌를 개설한다.', async () => {
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
        body: { courseDto: CourseDto },
      };

      courseService.createCourse.mockResolvedValue(mockCourse);

      await courseController.createCourse(req.body, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강좌 개설 완료',
        mockCourse,
      );
    });
  });

  describe('getAllCourses', () => {
    it('모든 강좌를 조회', async () => {
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

      courseService.findAllCourses.mockResolvedValue([mockCourse]);

      await courseController.getAllCourses(res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '모든 강좌 조회 성공',
        [mockCourse],
      );
    });
  });

  describe('getCourseDetail', () => {
    it('courseId를 받아 강좌를 상세 조회한다', async () => {
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

      const courseId = 1;

      courseService.findCourseDetail.mockResolvedValue(mockCourse);

      await courseController.getCourseDetail(courseId, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '강좌 상세 조회 성공',
        mockCourse,
      );
    });
  });

  describe('getAllCourseForSchedule', () => {
    it('본인 달력에 맞춰 강좌 조회', async () => {
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

      courseService.findAllCoursesForSchedule.mockResolvedValue([mockCourse]);

      await courseController.getAllCourseForSchedule(res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '달력에 맞춘 강좌 조회 성공',
        [mockCourse],
      );
    });
  });
});
