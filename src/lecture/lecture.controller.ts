import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureDto } from './dto/lecture.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { UpdateLectureDto } from './dto/updateLecture.dto';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly lectureService: LectureService,
  ) {}

  /* lecture 생성 */
  @Post()
  async createLecture(@Body() lectureDto: LectureDto, @Res() res: Response) {
    const { userId, userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(res, '강의 생성 권한이 없습니다.');
    }

    const newLecture = await this.lectureService.createLecture(
      lectureDto,
      userId,
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

  /* 강의 상세 조회 */
  @Get(':lectureId')
  async getLectureDetail(
    @Param('lectureId') lectureId: number,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    const lecture = await this.lectureService.findLectureDetail(
      userId,
      lectureId,
    );

    this.responseService.success(res, '강의 상세 조회 성공', lecture);
  }

  /* 강의 수정 */
  @Put(':lectureId')
  async updateLecture(
    @Param('lectureId') lectureId: number,
    @Body() updateLectureDto: UpdateLectureDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    await this.lectureService.updateLecture(
      userId,
      lectureId,
      updateLectureDto,
    );

    this.responseService.success(res, '강의 수정 성공');
  }

  /* 강의 삭제 */
  @Delete(':lectureId')
  async softDeleteLecture(
    @Param('lectureId') lectureId: number,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    await this.lectureService.softDeleteLecture(userId, lectureId);

    this.responseService.success(res, '강의 삭제 성공');
  }
}
