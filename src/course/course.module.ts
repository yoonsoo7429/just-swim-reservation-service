import { forwardRef, Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { CourseRepository } from './course.repository';
import { LectureModule } from 'src/lecture/lecture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => LectureModule),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}
