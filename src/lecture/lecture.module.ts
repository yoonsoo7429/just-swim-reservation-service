import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
