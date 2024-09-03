import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MakeUpRegistrationRepository } from './make-up-registration.repository';
import { MakeUpRegistration } from './entity/make-up-registration.entity';
import { DeleteResult } from 'typeorm';
import { MakeUpLectureRepository } from 'src/make-up-lecture/make-up-lecture.repository';

@Injectable()
export class MakeUpRegistrationService {
  constructor(
    private readonly makeUpLectureRepository: MakeUpLectureRepository,
    private readonly makeUpRegistrationRepository: MakeUpRegistrationRepository,
  ) {}

  /* 보충 예약 신청 */
  async createMakeUpRegistration(
    userId: number,
    makeUpLectureId: number,
  ): Promise<MakeUpRegistration> {
    // 보강 강의 정보 조회
    const makeUpLecture =
      await this.makeUpLectureRepository.findMakeUpLectureDetail(
        makeUpLectureId,
      );

    if (!makeUpLecture) {
      throw new NotFoundException('보강 강의를 찾을 수 없습니다.');
    }

    // 현재 예약 수 확인
    const registrationCount =
      await this.makeUpRegistrationRepository.registrationCount(
        makeUpLectureId,
      );

    if (registrationCount >= makeUpLecture.makeUpCapacity) {
      throw new ConflictException('예약 가능한 인원이 모두 차 있습니다.');
    }

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
