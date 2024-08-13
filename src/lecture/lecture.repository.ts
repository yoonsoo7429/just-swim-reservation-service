import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { Repository, UpdateResult } from 'typeorm';
import { LectureDto } from './dto/lecture.dto';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  /* lecture 생성 */
  async createLecture(lectureDto: LectureDto): Promise<Lecture> {
    const {
      lectureTitle,
      lectureContent,
      lectureTime,
      lectureDays,
      lectureEndDate,
    } = lectureDto;

    const lecture = new Lecture();
    lecture.lectureTitle = lectureTitle;
    lecture.lectureContent = lectureContent;
    lecture.lectureTime = lectureTime;
    lecture.lectureDays = lectureDays;
    lecture.lectureEndDate = lectureEndDate;
    await this.lectureRepository.save(lecture);

    return lecture;
  }

  /* QRCode 저장 */
  async saveQRCode(
    lectureId: number,
    lectureQRCode: string,
  ): Promise<UpdateResult> {
    return await this.lectureRepository.update(
      { lectureId },
      { lectureQRCode },
    );
  }
}
