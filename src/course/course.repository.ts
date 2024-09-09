import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}
}
