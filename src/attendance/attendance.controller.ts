import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dto/attendance.dto';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly attendanceService: AttendanceService,
  ) {}

  /* 출석 체크 */
  @Post()
  async createAttendance(
    @Body() attendanceDto: AttendanceDto,
    @Res() res: Response,
  ) {
    const { userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(res, '출결 체크 권한이 없습니다.');
    }

    await this.attendanceService.createAttendance(attendanceDto);

    this.responseService.success(res, '출석 체크 성공');
  }

  /* 출결 취소 */
  @Delete()
  async deleteAttendance(
    @Body() attendanceDto: AttendanceDto,
    @Res() res: Response,
  ) {
    const { userType } = res.locals.user;

    if (userType !== 'instructor') {
      this.responseService.unauthorized(res, '출결 취소 권한이 없습니다.');
    }

    await this.attendanceService.deleteAttendance(attendanceDto);

    this.responseService.success(res, '출석 취소 성공');
  }
}
