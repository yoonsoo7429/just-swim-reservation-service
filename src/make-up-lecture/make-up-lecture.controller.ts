import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { MakeUpLectureService } from './make-up-lecture.service';
import { MakeUpLectureDto } from './dto/make-up-lecture.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { MakeUpLecture } from './entity/make-up-lecture.entity';

@Controller('makeUpLecture')
export class MakeUpLectureController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly makeUpLectureService: MakeUpLectureService,
  ) {}

  /* instructor가 보강 가능 날짜 오픈하기 */
  @Post()
  async createMakeUpLecture(
    @Body() makeUpLectureDto: MakeUpLectureDto,
    @Res() res: Response,
  ) {
    const { userId, userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(
        res,
        '보강을 열 수 있는 권한이 없습니다.',
      );
    }

    await this.makeUpLectureService.createMakeUpLecture(
      userId,
      makeUpLectureDto,
    );
    this.responseService.success(res, '보강 오픈 성공');
  }

  /* instructor가 등록한 보강 가능 날짜 가져오기 */
  @Get(':lectureId')
  async getMakeUpLecturesByLectureId(
    @Param('lectureId') lectureId: number,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    const makeUpLectures =
      await this.makeUpLectureService.findMakeUpLecturesByLectureId(
        userId,
        lectureId,
      );

    this.responseService.success(res, '보강 조회 성공', makeUpLectures);
  }

  /* instructor가 등록한 보강 날짜 취소하기 */
  @Delete(':lectureId')
  async deleteMakeUpLecture(
    @Param('lectureId') lectureId: number,
    @Query('makeUpLectureDay') makeUpLectureDay: string,
    @Query('makeUpLectureTime') makeUpLectureTime: string,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    await this.makeUpLectureService.deleteMakeUpLecture(
      userId,
      lectureId,
      makeUpLectureDay,
      makeUpLectureTime,
    );

    this.responseService.success(res, '보강 취소 성공');
  }
}
