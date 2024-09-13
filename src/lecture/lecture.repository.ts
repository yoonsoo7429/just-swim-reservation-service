import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  /* member 등록에 맞춰 강의 생성 */
  async createLecturesForNewMember(
    lecturesToCreate: Partial<Lecture>[],
  ): Promise<Lecture[]> {
    const lectures = lecturesToCreate.map((lecture) =>
      this.lectureRepository.create(lecture),
    );

    return await this.lectureRepository.save(lectures);
  }
}
