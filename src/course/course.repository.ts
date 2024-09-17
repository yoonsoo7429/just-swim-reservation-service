import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { Repository } from 'typeorm';
import { CourseDto } from './dto/course.dto';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  /* 강좌 개설 */
  async createCourse(userId: number, courseDto: CourseDto): Promise<Course> {
    const { courseDays, courseStartTime, courseEndTime, courseCapacity } =
      courseDto;

    const course = this.courseRepository.create({
      courseDays,
      courseStartTime,
      courseEndTime,
      courseCapacity,
      user: { userId },
    });
    await this.courseRepository.save(course);

    return course;
  }

  /* 강좌 상세 정보 */
  async findCourseDetail(courseId: number): Promise<Course> {
    return await this.courseRepository.findOne({
      where: { courseId },
      relations: ['user', 'member', 'member.user', 'lecture'],
    });
  }

  /* 모든 강좌 조회 */
  async findAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { courseDeletedAt: null },
    });
  }

  /* 달력에 맞춰 강좌 조회(instructor) */
  async findAllCoursesForScheduleByInstructor(
    userId: number,
  ): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { user: { userId } },
      relations: ['member', 'member.user', 'user'],
    });
  }

  /* 달력에 맞춰 강좌 조회(customer) */
  async findAllCoursesForScheduleByCustomer(userId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { member: { user: { userId } } },
      relations: ['member', 'member.user', 'user'],
    });
  }
}
