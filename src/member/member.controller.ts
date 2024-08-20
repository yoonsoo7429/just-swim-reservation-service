import { Controller, Get, Param, Res } from '@nestjs/common';
import { MemberService } from './member.service';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';

@Controller('member')
export class MemberController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly memberService: MemberService,
  ) {}

  /* 수강생 목록 조회 */
  @Get(':lectureId')
  async getAllMembersByLectureId(
    @Param('lectureId') lectureId: number,
    @Res() res: Response,
  ) {
    const { userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(
        res,
        '수강생 목록 조회 권한이 없습니다.',
      );
    }

    const members =
      await this.memberService.findAllMembersByLectureId(lectureId);

    this.responseService.success(res, '수강생 목록 조회 성공', members);
  }
}
