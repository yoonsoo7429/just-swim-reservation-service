import { Body, Controller, Param, Patch, Res } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { ResponseService } from 'src/common/response/response.service';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { Response } from 'express';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly lectureService: LectureService,
  ) {}

  /* 수강생이 강좌에 자리가 있을 때 담당 강사의 강좌 내에서 자리를 옮길 수 있음
    (보강 자리가 있으면 보강을 잡는 개념과 비슷하다.) */
  @Patch(':lectureId')
  async updateLecture(
    @Param('lectureId') lectureId: number,
    @Body() updateLectureDto: UpdateLectureDto,
    @Res() res: Response,
  ) {
    const { userId, userType } = res.locals.user;

    await this.lectureService.updateLecture(
      userId,
      userType,
      lectureId,
      updateLectureDto,
    );

    this.responseService.success(res, '강의 업데이트 성공');
  }
}
