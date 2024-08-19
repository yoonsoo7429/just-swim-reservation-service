import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entity/attendance.entity';
import { DeleteResult, Repository } from 'typeorm';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  /* 출석 체크 */
  async createAttendance(attendanceDto: AttendanceDto): Promise<Attendance> {
    const { attendanceDay, userId, lectureId } = attendanceDto;

    const attendance = new Attendance();
    attendance.user.userId = userId;
    attendance.lecture.lectureId = lectureId;
    attendance.attendanceDay = attendanceDay;
    await this.attendanceRepository.save(attendance);

    return attendance;
  }

  /* 출석 취소 */
  async deleteAttendance(attendanceDto: AttendanceDto): Promise<DeleteResult> {
    const { attendanceDay, userId, lectureId } = attendanceDto;
    return await this.attendanceRepository.delete({
      user: { userId },
      lecture: { lectureId },
      attendanceDay,
    });
  }

  /* 출결 횟수 조회 */
  async countAttendances(lectureId: number, userId: number): Promise<number> {
    return await this.attendanceRepository.countBy({
      user: { userId },
      lecture: { lectureId },
    });
  }
}
