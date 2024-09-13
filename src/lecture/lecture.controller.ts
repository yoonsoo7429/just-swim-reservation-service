import { Controller } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { ResponseService } from 'src/common/response/response.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly lectureService: LectureService,
  ) {}
}
