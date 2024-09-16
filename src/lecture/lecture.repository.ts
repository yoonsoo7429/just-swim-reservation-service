import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  /* member 등록에 맞춰 강의 생성 */
  async createLecturesForMember(
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

  /* lecture 상세 조회 */
  async findLectureDetail(lectureId: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({
      where: { lectureId },
      relations: ['course', 'course.user', 'user'],
    });
  }

  /* 강의 업데이트 */
  async updateLecture(
    userId: number,
    lectureId: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<UpdateResult> {
    const { courseId, lectureDate, lectureStartTime, lectureEndTime } =
      updateLectureDto;
    return await this.lectureRepository.update(
      { lectureId, user: { userId } },
      { lectureDate, lectureStartTime, lectureEndTime, course: { courseId } },
    );
  }
}
