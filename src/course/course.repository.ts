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

    const course = new Course();
    course.user.userId = userId;
    course.courseDays = courseDays;
    course.courseStartTime = courseStartTime;
    course.courseEndTime = courseEndTime;
    course.courseCapacity = courseCapacity;
    await this.courseRepository.save(course);

    return course;
  }

  /* 강좌 상세 정보 */
  async findCourseDetail(courseId: number): Promise<Course> {
    return await this.courseRepository.findOne({ where: { courseId } });
  }
}
