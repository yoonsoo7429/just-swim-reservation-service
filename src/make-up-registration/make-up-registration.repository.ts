import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeUpRegistration } from './entity/make-up-registration.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class MakeUpRegistrationRepository {
  constructor(
    @InjectRepository(MakeUpRegistration)
    private makeUpRegistrationRepository: Repository<MakeUpRegistration>,
  ) {}

  /* 보충 예약 신청 */
  async createMakeUpRegistration(
    userId: number,
    makeUpLectureId: number,
  ): Promise<MakeUpRegistration> {
    const makeUpRegistration = new MakeUpRegistration();
    makeUpRegistration.user.userId = userId;
    makeUpRegistration.makeUpLecture.makeUpLectureId = makeUpLectureId;

    await this.makeUpRegistrationRepository.save(makeUpRegistration);
    return makeUpRegistration;
  }

  /* 보강 예약 취소 */
  async deleteMakeUpRegistration(
    userId: number,
    makeUpLectureId: number,
  ): Promise<DeleteResult> {
    return await this.makeUpRegistrationRepository.delete({
      user: { userId },
      makeUpLecture: { makeUpLectureId },
    });
  }

  /* 보강 예약한 횟수 조회 */
  async registrationCount(makeUpLectureId: number): Promise<number> {
    return await this.makeUpRegistrationRepository.count({
      where: { makeUpLecture: { makeUpLectureId } },
    });
  }
}
