import { Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { MakeUpRegistrationService } from './make-up-registration.service';
import { ResponseService } from 'src/common/response/response.service';
import { Response } from 'express';

@Controller('makeUpRegistration')
export class MakeUpRegistrationController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly makeUpRegistrationService: MakeUpRegistrationService,
  ) {}

  /* 보강 예약 신청 */
  @Post(':makeUpLectureId')
  async createMakeUpRegistration(
    @Res() res: Response,
    @Param('makeUpLectureId') makeUpLectureId: number,
  ) {
    const { userId, userType } = res.locals.user;

    if (userType !== 'customer') {
      this.responseService.unauthorized(res, '보강 예약 신청 권한이 없습니다.');
    }

    const makeUpRegistration =
      await this.makeUpRegistrationService.createMakeUpRegistration(
        userId,
        makeUpLectureId,
      );

    this.responseService.success(
      res,
      '보강 예약 신청 성공',
      makeUpRegistration,
    );
  }

  /* 보강 예약 취소 */
  @Delete(':makeUpLectureId')
  async deleteMakeUpRegistration(
    @Res() res: Response,
    @Param('makeUpLectureId') makeUpLectureId: number,
  ) {
    const { userId } = res.locals.user;

    await this.makeUpRegistrationService.deleteMakeUpRegistration(
      userId,
      makeUpLectureId,
    );

    this.responseService.success(res, '보강 예약 취소 성공');
  }
}
