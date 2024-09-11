import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CourseDto } from './dto/course.dto';
import { Course } from './entity/course.entity';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  /* 강좌 개설 */
  async createCourse(userId: number, courseDto: CourseDto): Promise<Course> {
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
}
