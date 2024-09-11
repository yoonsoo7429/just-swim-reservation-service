import { Body, Controller, Post, Res } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './dto/member.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { UserType } from 'src/users/enum/user-type.enum';

@Controller('member')
export class MemberController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly memberService: MemberService,
  ) {}

  /* instructor의 권한으로 customer를 member로 등록 */
  @Post()
  async createMember(@Body() memberDto: MemberDto, @Res() res: Response) {
    const { userId, userType } = res.locals.user;

    if (userType !== UserType.Instructor) {
      this.responseService.unauthorized(res, '수강생 등록 권한이 없습니다.');
    }

    const courseId = memberDto.courseId;
    const member = await this.memberService.createMember(
      courseId,
      userId,
      memberDto,
    );

    this.responseService.success(res, '수강생 등록 성공', member);
  }
}
