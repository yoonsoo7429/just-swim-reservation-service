import { Body, Controller, Post, Res } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureDto } from './dto/lecture.dto';
import { Response } from 'express';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  /* lecture 생성 */
  @Post()
  async createLecture(
    @Body('lectureDto') lectureDto: LectureDto,
    @Res() res: Response,
  ) {}
}
