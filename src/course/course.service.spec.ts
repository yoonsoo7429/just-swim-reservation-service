import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { Course } from './entity/course.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { CourseRepository } from './course.repository';

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
});
