import { forwardRef, Module } from '@nestjs/common';
import { MakeUpLectureController } from './make-up-lecture.controller';
import { MakeUpLectureService } from './make-up-lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeUpLecture } from './entity/make-up-lecture.entity';
import { MakeUpLectureRepository } from './make-up-lecture.repository';
import { LectureModule } from 'src/lecture/lecture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MakeUpLecture]),
    forwardRef(() => LectureModule),
  ],
  controllers: [MakeUpLectureController],
  providers: [MakeUpLectureService, MakeUpLectureRepository],
  exports: [MakeUpLectureService, MakeUpLectureRepository],
})
export class MakeUpLectureModule {}
