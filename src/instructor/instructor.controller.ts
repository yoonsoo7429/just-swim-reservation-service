import { Body, Controller, Post, Res } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { InstructorService } from './instructor.service';
import { InstructorDto } from './dto/instructor.dto';
import { Response } from 'express';
import { UserType } from 'src/users/enum/user-type.enum';

@Controller('instructor')
export class InstructorController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly instructorService: InstructorService,
  ) {}

  /* userType 지정 후 instructor 정보 입력 */
  @Post()
  async createInstructor(
    @Body() instructorDto: InstructorDto,
    @Res() res: Response,
  ) {
    const { userId, userType } = res.locals.user;

    if (userType !== UserType.Instructor) {
      this.responseService.unauthorized(
        res,
        '현재 계정은 강사 프로필을 작성할 수 없습니다.',
      );
    }

    const instructor = await this.instructorService.createInstructor(
      userId,
      instructorDto,
    );

    this.responseService.success(res, '강사 정보 입력 완료', instructor);
  }
}
