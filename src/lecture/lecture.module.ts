import { forwardRef, Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { AwsModule } from 'src/common/aws/aws.module';
import { LectureRepository } from './lecture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture]), forwardRef(() => AwsModule)],
  controllers: [LectureController],
  providers: [LectureService, LectureRepository],
  exports: [LectureService, LectureRepository],
})
export class LectureModule {}
