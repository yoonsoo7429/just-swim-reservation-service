import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';
import { Lecture } from './entity/lecture.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { LectureRepository } from './lecture.repository';
import { MemberRepository } from 'src/member/member.repository';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { MockCourseRepository } from 'src/course/course.service.spec';
import { CourseRepository } from 'src/course/course.repository';
import { MockMemberRepository } from 'src/member/member.service.spec';
import { UserType } from 'src/users/enum/user-type.enum';
import * as moment from 'moment';

const mockUser = new MockUsersRepository().mockUser;
const mockMember = new MockMemberRepository().mockMember;
const mockCourse = new MockCourseRepository().mockCourse;

export class MockLectureRepository {
  readonly mockLecture: Lecture = {
    lectureId: 1,
    user: mockUser,
    course: mockCourse,
    lectureDate: 'Monday,Wednesday,Friday',
    lectureStartTime: '16:00',
    lectureEndTime: '17:00',
    lectureCreatedAt: new Date(),
    lectureUpdatedAt: new Date(),
    lectureDeletedAt: null,
  };
}

describe('LectureService', () => {
  let lectureService: LectureService;
  let lectureRepository: LectureRepository;
  let memberRepository: MemberRepository;
  let courseRepository: CourseRepository;

  const mockLecture = new MockLectureRepository().mockLecture;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LectureService,
        {
          provide: LectureRepository,
          useValue: {
            createLecturesForMember: jest.fn(),
            deleteLecturesForMember: jest.fn(),
            findLectureDetail: jest.fn(),
            updateLecture: jest.fn(),
            expirePastLectures: jest.fn(),
          },
        },
        {
          provide: MemberRepository,
          useValue: { findAllMembers: jest.fn() },
        },
        {
          provide: CourseRepository,
          useValue: { findCourseDetail: jest.fn() },
        },
      ],
    }).compile();

    lectureService = module.get<LectureService>(LectureService);
    lectureRepository = module.get<LectureRepository>(LectureRepository);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    courseRepository = module.get<CourseRepository>(CourseRepository);
  });

  it('should be defined', () => {
    expect(lectureService).toBeDefined();
  });

  describe('createLecture', () => {
    it('강의를 생성하고 강의 정보를 return', async () => {
      const userId = 1;
      const courseId = 1;
      const lectureDays = 'Monday,Wednesday,Friday';
      const lectureStartTime = '16:00';
      const lectureEndTime = '17:00';
      const lecturesToCreate = [
        {
          lectureDate: '2024-09-19',
          lectureStartTime,
          lectureEndTime,
          user: { userId },
          course: { courseId },
        },
      ];

      jest
        .spyOn(lectureRepository, 'createLecturesForMember')
        .mockResolvedValue([mockLecture]);

      const result = await lectureService.createLecturesForMember(
        courseId,
        userId,
        lectureDays,
        lectureStartTime,
        lectureEndTime,
      );

      expect(result).toEqual([mockLecture]);
    });
  });

  describe('deleteLecturesForMember', () => {
    it('수강생 등록 취소에 맞춰 강의를 삭제한다', async () => {
      const userId = 1;
      const courseId = 1;

      (
        lectureRepository.deleteLecturesForMember as jest.Mock
      ).mockResolvedValue(DeleteResult);

      const result = await lectureService.deleteLecturesForMember(
        courseId,
        userId,
      );

      expect(result).toEqual(DeleteResult);
      expect(lectureRepository.deleteLecturesForMember).toHaveBeenCalledWith(
        courseId,
        userId,
      );
    });
  });

  describe('createLecturesForNextMonth', () => {
    it('매달 첫 날, member에 맞춰 다음 달 강의 생성', async () => {
      jest
        .spyOn(memberRepository, 'findAllMembers')
        .mockResolvedValue([mockMember]);

      await lectureService.createLecturesForNextMonth();

      expect(memberRepository.findAllMembers).toHaveBeenCalled();
      expect(lectureRepository.createLecturesForMember).toHaveBeenCalled();
    });
  });

  describe('updateLecture', () => {
    it('강의를 수정하고 UpdateResult를 반환해야 한다', async () => {
      const userId = 1;
      const lectureId = 1;
      const updateLectureDto: UpdateLectureDto = {
        lectureDate: '2024-09-20',
        lectureStartTime: '18:00',
        lectureEndTime: '19:00',
        courseId: 1,
      };

      jest
        .spyOn(courseRepository, 'findCourseDetail')
        .mockResolvedValue(mockCourse);
      jest
        .spyOn(lectureRepository, 'findLectureDetail')
        .mockResolvedValue(mockLecture);
      (lectureRepository.updateLecture as jest.Mock).mockResolvedValue(
        UpdateResult,
      );

      const result = await lectureService.updateLecture(
        userId,
        UserType.Instructor,
        lectureId,
        updateLectureDto,
      );

      expect(result).toEqual(UpdateResult);
      expect(lectureRepository.findLectureDetail).toHaveBeenCalledWith(
        lectureId,
      );
      expect(lectureRepository.updateLecture).toHaveBeenCalledWith(
        userId,
        lectureId,
        updateLectureDto,
      );
    });
  });

  describe('expirePastLectures', () => {
    it('지난 강의를 만료 처리한다', async () => {
      const today = moment().format('YYYY-MM-DD');
      jest
        .spyOn(lectureRepository, 'expirePastLectures')
        .mockResolvedValue(undefined);

      await lectureService.expirePastLectures();

      expect(lectureRepository.expirePastLectures).toHaveBeenCalledWith(today);
    });
  });
});
