import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CourseDto } from './dto/course.dto';
import { Course } from './entity/course.entity';
import { UserType } from 'src/users/enum/user-type.enum';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  /* 강좌 개설 */
  async createCourse(userId: number, courseDto: CourseDto): Promise<Course> {
    // 겹치는 시간대 확인
    const overlappingCourse = await this.courseRepository.findOverlappingCourse(
      userId,
      courseDto,
    );
    if (overlappingCourse) {
      throw new ConflictException('이미 겹치는 시간에 강좌가 있습니다.');
    }

    return await this.courseRepository.createCourse(userId, courseDto);
  }

  /* 모든 강좌 조회 */
  async findAllCourses(): Promise<Course[]> {
    return await this.courseRepository.findAllCourses();
  }

  /* 강좌 상세 조회 */
  async findCourseDetail(courseId: number, userId: number): Promise<Course> {
    const course = await this.courseRepository.findCourseDetail(courseId);
    if (course.user.userId !== userId) {
      throw new UnauthorizedException('강좌 상세 조회 권한이 없습니다.');
    }

    return course;
  }

  /* 달력에 맞춰 강좌 조회 */
  async findAllCoursesForSchedule(
    userId: number,
    userType: UserType,
  ): Promise<Course[]> {
    // 강사 조회
    if (userType === UserType.Instructor) {
      const coursesByInstructor =
        await this.courseRepository.findAllCoursesForScheduleByInstructor(
          userId,
        );
      return coursesByInstructor;
    }

    // 수강생 조회
    if (userType === UserType.Customer) {
      const coursesByCustomer =
        await this.courseRepository.findAllCoursesForScheduleByCustomer(userId);
      return coursesByCustomer;
    }

    throw new BadRequestException('잘못된 사용자 타입입니다.');
  }
}
