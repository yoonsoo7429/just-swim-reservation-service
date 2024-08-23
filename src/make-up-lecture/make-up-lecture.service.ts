import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MakeUpLectureRepository } from './make-up-lecture.repository';
import { MakeUpLectureDto } from './dto/make-up-lecture.dto';
import { MakeUpLecture } from './entity/make-up-lecture.entity';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class MakeUpLectureService {
  constructor(
    private readonly makeUpLectureRepository: MakeUpLectureRepository,
    private readonly lectureRepository: LectureRepository,
  ) {}

  /* 보강 생성 */
  async createMakeUpLecture(
    userId: number,
    makeUpLectureDto: MakeUpLectureDto,
  ): Promise<MakeUpLecture> {
    return await this.makeUpLectureRepository.createMakeUpLecture(
      userId,
      makeUpLectureDto,
    );
  }

  /* lectureId에 해당하는 보강 조회 */
  async findMakeUpLecturesByLectureId(
    userId: number,
    lectureId: number,
  ): Promise<MakeUpLecture[]> {
    const lecture = await this.lectureRepository.findLectureDetail(lectureId);

    const makeUpLectures =
      await this.makeUpLectureRepository.findMakeUpLecturesByLectureId(
        lectureId,
      );

    // 강사 권한 확인
    if (lecture.user.userId === userId) {
      return makeUpLectures;
    }
    // 수강생 권한 확인
    if (lecture.member.some((member) => member.user.userId === userId)) {
      return makeUpLectures;
    }
  }

  /* 보강 날짜 취소 */
  async deleteMakeUpLecture(
    userId: number,
    lectureId: number,
    makeUpLectureDay: string,
    makeUpLectureTime: string,
  ): Promise<DeleteResult> {
    const result = await this.makeUpLectureRepository.deleteMakeUpLecture(
      userId,
      lectureId,
      makeUpLectureDay,
      makeUpLectureTime,
    );

    if (result.affected === 0) {
      throw new InternalServerErrorException('보강 취소 실패');
    }

    return result;
  }
}
