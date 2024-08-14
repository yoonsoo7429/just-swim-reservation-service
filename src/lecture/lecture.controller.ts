import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureDto } from './dto/lecture.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly lectureService: LectureService,
  ) {}

  /* lecture 생성 */
  @Post()
  async createLecture(
    @Body('lectureDto') lectureDto: LectureDto,
    @Res() res: Response,
  ) {
    const { userId, userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(res, '강의 생성 권한이 없습니다.');
    }

    const newLecture = await this.lectureService.createLecture(
      userId,
      lectureDto,
    );

    this.responseService.success(res, '강의 생성 성공', newLecture);
  }

  /* 강의 전체 조회 */
  @Get()
  async getAllLectures(@Res() res: Response) {
    const { userId, userType } = res.locals.user;

    const lectures = await this.lectureService.findAllLectures(
      userId,
      userType,
    );

    this.responseService.success(res, '전체 강의 조회 성공', lectures);
  }
}
