import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entity/attendance.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { MockLectureRepository } from 'src/lecture/lecture.service.spec';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceDto } from './dto/attendance.dto';
import { DeleteResult } from 'typeorm';

const mockUser = new MockUsersRepository().mockUser;
const mockLecture = new MockLectureRepository().mockLecture;

export class MockAttendanceRepository {
  readonly mockAttendance: Attendance = {
    attendanceId: 1,
    user: mockUser,
    lecture: mockLecture,
    attendanceDay: '2024.08.19',
    attendanceCreatedAt: new Date(),
    attendanceUpdatedAt: new Date(),
  };
}

describe('AttendanceService', () => {
  let attendanceService: AttendanceService;
  let attendanceRepository: AttendanceRepository;

  const mockAttendance = new MockAttendanceRepository().mockAttendance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: AttendanceRepository,
          useValue: {
            createAttendance: jest.fn(),
            deleteAttendance: jest.fn(),
            countAttendances: jest.fn(),
          },
        },
      ],
    }).compile();

    attendanceService = module.get<AttendanceService>(AttendanceService);
    attendanceRepository =
      module.get<AttendanceRepository>(AttendanceRepository);
  });

  it('should be defined', () => {
    expect(attendanceService).toBeDefined();
  });

  describe('createAttendance', () => {
    it('attendanceDto를 이용해 출결 체크', async () => {
      const attendanceDto: AttendanceDto = {
        attendanceDay: '2024.08.19',
        userId: mockUser.userId,
        lectureId: mockLecture.lectureId,
      };
      const newAttendance: Attendance = {
        attendanceId: 1,
        attendanceDay: attendanceDto.attendanceDay,
        user: mockUser,
        lecture: mockLecture,
        attendanceCreatedAt: new Date(),
        attendanceUpdatedAt: new Date(),
      };
      (attendanceRepository.createAttendance as jest.Mock).mockResolvedValue(
        newAttendance,
      );

      const result = await attendanceService.createAttendance(attendanceDto);

      expect(attendanceRepository.createAttendance).toHaveBeenCalledWith(
        attendanceDto,
      );
      expect(result).toEqual(undefined);
    });
  });

  describe('deleteAttendance', () => {
    it('attendanceDto를 이용해 출결 취소', async () => {
      const attendanceDto: AttendanceDto = {
        attendanceDay: '2024.08.19',
        userId: 1,
        lectureId: 1,
      };

      (attendanceRepository.deleteAttendance as jest.Mock).mockResolvedValue(
        DeleteResult,
      );

      const result = await attendanceService.deleteAttendance(attendanceDto);

      expect(attendanceRepository.deleteAttendance).toHaveBeenCalledWith(
        attendanceDto,
      );
      expect(result).toEqual(undefined);
    });
  });

  describe('getAttendanceCount', () => {
    it('그 달에 출석한 횟수를 count해서 return', async () => {
      const lectureId = 1;
      const userId = 1;
      const mockCount = 5;
      (attendanceRepository.countAttendances as jest.Mock).mockResolvedValue(
        mockCount,
      );

      const result = await attendanceService.getAttendanceCount(
        lectureId,
        userId,
      );
      expect(attendanceRepository.countAttendances).toHaveBeenCalledWith(
        lectureId,
        userId,
      );
      expect(result).toEqual(mockCount);
    });
  });
});
