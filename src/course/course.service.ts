import { Injectable } from '@nestjs/common';
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
}
