import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeUpLecture } from './entity/make-up-lecture.entity';
import { DeleteResult, Repository } from 'typeorm';
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
    const makeUpLecture = new MakeUpLecture();
    const { lectureId, makeUpLectureDay, makeUpLectureTime, makeUpCapacity } =
      makeUpLectureDto;
    makeUpLecture.user.userId = userId;
    makeUpLecture.lecture.lectureId = lectureId;
    makeUpLecture.makeUpLectureDay = makeUpLectureDay;
    makeUpLecture.makeUpLectureTime = makeUpLectureTime;
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
    makeUpLectureTime: string,
  ): Promise<DeleteResult> {
    return await this.makeUpLectureRepository.delete({
      user: { userId },
      lecture: { lectureId },
      makeUpLectureDay,
      makeUpLectureTime,
    });
  }
}
