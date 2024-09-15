import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { DeleteResult, Repository } from 'typeorm';

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

  /* member 등록 취소에 맞춰 강의 삭제 */
  async deleteLecturesForMember(
    courseId: number,
    userId: number,
  ): Promise<DeleteResult> {
    return await this.lectureRepository.delete({
      course: { courseId },
      user: { userId },
    });
  }
}
