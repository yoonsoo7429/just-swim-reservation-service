import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { UserType } from 'src/users/enum/user-type.enum';

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

  /* 모든 강좌 조회 */
  @Get()
  async getAllCourses(@Res() res: Response) {
    const { userType } = res.locals.user;

    if (userType !== UserType.Instructor) {
      this.responseService.unauthorized(res, '강좌 조회 권한이 없습니다.');
    }

    const courses = await this.courseService.findAllCourses();

    this.responseService.success(res, '모든 강좌 조회 성공', courses);
  }

  /* 강좌 상세 조회 */
  @Get(':courseId')
  async getCourseDetail(
    @Param('courseId') courseId: number,
    @Res() res: Response,
  ) {
    const { userId, userType } = res.locals.user;

    if (userType !== UserType.Instructor) {
      this.responseService.unauthorized(res, '강좌 상세 조회 권한이 없습니다.');
    }

    const course = await this.courseService.findCourseDetail(courseId, userId);

    this.responseService.success(res, '강좌 상세 조회 성공', course);
  }

  /* instructor 또는 customer가 본인 달력에 맞춰 강좌 조회 */
  @Get('schedule')
  async getAllCourseForSchedule(@Res() res: Response) {
    const { userId, userType } = res.locals.user;

    const courses = await this.courseService.findAllCoursesForSchedule(
      userId,
      userType,
    );

    this.responseService.success(res, '달력에 맞춘 강좌 조회 성공', courses);
  }
}
