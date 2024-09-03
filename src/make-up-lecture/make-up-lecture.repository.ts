import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeUpLecture } from './entity/make-up-lecture.entity';
import { DeleteResult, LessThan, MoreThan, Repository } from 'typeorm';
import { MakeUpLectureDto } from './dto/make-up-lecture.dto';

@Injectable()
export class MakeUpLectureRepository {
  constructor(
    @InjectRepository(MakeUpLecture)
    private makeUpLectureRepository: Repository<MakeUpLecture>,
  ) {}

  /* 보강 생성 */
  async createMakeUpLecture(
    userId: number,
    makeUpLectureDto: MakeUpLectureDto,
  ): Promise<MakeUpLecture> {
    const {
      lectureId,
      makeUpLectureDay,
      makeUpLectureStartTime,
      makeUpLectureEndTime,
      makeUpCapacity,
    } = makeUpLectureDto;

    const makeUpLecture = new MakeUpLecture();
    makeUpLecture.user.userId = userId;
    makeUpLecture.lecture.lectureId = lectureId;
    makeUpLecture.makeUpLectureDay = makeUpLectureDay;
    makeUpLecture.makeUpLectureStartTime = makeUpLectureStartTime;
    makeUpLecture.makeUpLectureEndTime = makeUpLectureEndTime;
    makeUpLecture.makeUpCapacity = makeUpCapacity;

    await this.makeUpLectureRepository.save(makeUpLecture);
    return makeUpLecture;
  }

  /* lectureId에 해당하는 보강 조회 */
  async findMakeUpLecturesByLectureId(
    lectureId: number,
  ): Promise<MakeUpLecture[]> {
    return await this.makeUpLectureRepository.find({
      where: { lecture: { lectureId } },
    });
  }

  /* 보강 날짜 취소 */
  async deleteMakeUpLecture(
    userId: number,
    lectureId: number,
    makeUpLectureDay: string,
    makeUpLectureStartTime: string,
  ): Promise<DeleteResult> {
    return await this.makeUpLectureRepository.delete({
      user: { userId },
      lecture: { lectureId },
      makeUpLectureDay,
      makeUpLectureStartTime,
    });
  }

  /* 겹치는 보충 강습 확인 */
  async findMakeUpLectureWithTimeConflict(
    userId: number,
    lectureId: number,
    makeUpLectureDay: string,
    makeUpLectureStartTime: string,
    makeUpLectureEndTime: string,
  ): Promise<MakeUpLecture> {
    return await this.makeUpLectureRepository.findOne({
      where: {
        user: { userId },
        lecture: { lectureId },
        makeUpLectureDay,
        makeUpLectureStartTime: LessThan(makeUpLectureEndTime),
        makeUpLectureEndTime: MoreThan(makeUpLectureStartTime),
      },
    });
  }

  /* 보충 강의 상세 조회 */
  async findMakeUpLectureDetail(
    makeUpLectureId: number,
  ): Promise<MakeUpLecture> {
    return await this.makeUpLectureRepository.findOne({
      where: { makeUpLectureId },
    });
  }
}
