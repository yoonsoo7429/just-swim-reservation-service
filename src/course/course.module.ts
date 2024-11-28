import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { CourseRepository } from './course.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}
