import { Body, Controller, Post, Res } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { UserType } from 'src/users/enum/userType.enum';

@Controller('course')
export class CourseController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly courseService: CourseService,
  ) {}

  /* 강좌 개설 */
  @Post()
  async createCourse(@Body() courseDto: CourseDto, @Res() res: Response) {
    const { userId, userType } = res.locals.user;

    if (userType !== UserType.Instructor) {
      this.responseService.unauthorized(res, '강좌 개설 권한이 없습니다.');
    }

    const course = await this.courseService.createCourse(userId, courseDto);

    this.responseService.success(res, '강좌 개설 완료', course);
  }
}
