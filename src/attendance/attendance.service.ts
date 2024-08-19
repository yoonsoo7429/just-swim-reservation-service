import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceDto } from './dto/attendance.dto';
import { Attendance } from './entity/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /* 출석 체크 */
  async createAttendance(attendanceDto: AttendanceDto): Promise<void> {
    const attendance =
      await this.attendanceRepository.createAttendance(attendanceDto);
    if (!attendance) {
      throw new InternalServerErrorException('출결 체크 실패');
    }
  }

  /* 출석 취소 */
  async deleteAttendance(attendanceDto: AttendanceDto): Promise<void> {
    const deleteResult =
      await this.attendanceRepository.deleteAttendance(attendanceDto);

    if (deleteResult.affected === 0) {
      throw new InternalServerErrorException('출결 취소 실패');
    }
  }

  /* 출석 횟수 조회*/
  async getAttendanceCount(lectureId: number, userId: number): Promise<number> {
    return await this.attendanceRepository.countAttendances(lectureId, userId);
  }
}
