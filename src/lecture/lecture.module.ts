import { forwardRef, Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { AwsModule } from 'src/common/aws/aws.module';
import { LectureRepository } from './lecture.repository';
import { MemberModule } from 'src/member/member.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecture]),
    forwardRef(() => AwsModule),
    forwardRef(() => MemberModule),
    forwardRef(() => CourseModule),
  ],
  controllers: [LectureController],
  providers: [LectureService, LectureRepository],
  exports: [LectureService, LectureRepository],
})
export class LectureModule {}
