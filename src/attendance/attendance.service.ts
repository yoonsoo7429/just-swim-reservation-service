import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceDto } from './dto/attendance.dto';
import { Attendance } from './entity/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /* 출석 체크 */
  async createAttendance(attendanceDto: AttendanceDto): Promise<void> {
    await this.attendanceRepository.createAttendance(attendanceDto);
  }

  /* 출석 취소 */
  async deleteAttendance(attendanceDto: AttendanceDto): Promise<void> {
    const deleteResult =
      await this.attendanceRepository.deleteAttendance(attendanceDto);
  }

  /* 출석 횟수 조회*/
  async getAttendanceCount(lectureId: number, userId: number): Promise<number> {
    return await this.attendanceRepository.countAttendances(lectureId, userId);
  }
}
