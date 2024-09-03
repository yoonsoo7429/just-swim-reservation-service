import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MakeUpRegistrationRepository } from './make-up-registration.repository';
import { MakeUpRegistration } from './entity/make-up-registration.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class MakeUpRegistrationService {
  constructor(
    private readonly makeUpRegistrationRepository: MakeUpRegistrationRepository,
  ) {}

  /* 보충 예약 신청 */
  async createMakeUpRegistration(
    userId: number,
    makeUpLectureId: number,
  ): Promise<MakeUpRegistration> {
    return await this.makeUpRegistrationRepository.createMakeUpRegistration(
      userId,
      makeUpLectureId,
    );
  }

  /* 보강 예약 취소 */
  async deleteMakeUpRegistration(
    userId: number,
    makeUpLectureId: number,
  ): Promise<DeleteResult> {
    const result =
      await this.makeUpRegistrationRepository.deleteMakeUpRegistration(
        userId,
        makeUpLectureId,
      );
    if (result.affected === 0) {
      throw new InternalServerErrorException('보강 예약 취소 실패');
    }

    return result;
  }
}
