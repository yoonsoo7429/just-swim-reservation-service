import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { Course } from './entity/course.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { CourseRepository } from './course.repository';
import { CourseDto } from './dto/course.dto';

const mockUser = new MockUsersRepository().mockUser;

export class MockCourseRepository {
  readonly mockCourse: Course = {
    courseId: 1,
    user: mockUser,
    courseDays: 'Monday,Wednesday,Friday',
    courseStartTime: '16:00',
    courseEndTime: '17:00',
    courseCapacity: 4,
    courseCreatedAt: new Date(),
    courseUpdatedAt: new Date(),
    courseDeletedAt: null,
    lecture: [],
    member: [],
  };
}

describe('CourseService', () => {
  let courseService: CourseService;
  let courseRepository: CourseRepository;

  const mockCourse = new MockCourseRepository().mockCourse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: CourseRepository,
          useValue: {
            createCourse: jest.fn(),
            findCourseDetail: jest.fn(),
            findAllCourses: jest.fn(),
            findAllCoursesForScheduleByInstructor: jest.fn(),
            findAllCoursesForScheduleByCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    courseRepository = module.get<CourseRepository>(CourseRepository);
  });

  it('should be defined', () => {
    expect(courseService).toBeDefined();
  });

  describe('createCourse', () => {
    it('강좌를 개설하고 해당 강좌 정보를 return', async () => {
      const mockCourseDto: CourseDto = {
        courseDays: 'Monday,Wednesday,Friday',
        courseStartTime: '16:00',
        courseEndTime: '17:00',
        courseCapacity: 4,
      };
      const userId = 1;

      (courseRepository.createCourse as jest.Mock).mockResolvedValue(
        mockCourse,
      );

      const result = await courseService.createCourse(userId, mockCourseDto);

      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAllCourses', () => {
    it('모든 강좌를 조회해서 return', async () => {
      (courseRepository.findAllCourses as jest.Mock).mockResolvedValue([
        mockCourse,
      ]);

      const result = await courseService.findAllCourses();

      expect(result).toEqual([mockCourse]);
    });
  });

  describe('findCourseDetail', () => {
    it('courseId를 받아 강좌의 상세 정보를 return', async () => {
      const courseId = mockCourse.courseId;
      const userId = mockUser.userId;
      (courseRepository.findCourseDetail as jest.Mock).mockResolvedValue(
        mockCourse,
      );

      const result = await courseService.findCourseDetail(courseId, userId);

      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAllCoursesForSchedule', () => {
    it('달력에 맞춰 강좌 return', async () => {
      const userId = mockUser.userId;
      const userType = mockUser.userType;
      (
        courseRepository.findAllCoursesForScheduleByInstructor as jest.Mock
      ).mockResolvedValue([mockCourse]);
      (
        courseRepository.findAllCoursesForScheduleByCustomer as jest.Mock
      ).mockResolvedValue([mockCourse]);

      const result = await courseService.findAllCoursesForSchedule(
        userId,
        userType,
      );

      expect(result).toEqual([mockCourse]);
    });
  });
});
