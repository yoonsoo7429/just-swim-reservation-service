import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Member } from './entity/member.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { MockCourseRepository } from 'src/course/course.service.spec';
import { MemberRepository } from './member.repository';
import { CourseService } from 'src/course/course.service';
import { LectureService } from 'src/lecture/lecture.service';
import { MemberDto } from './dto/member.dto';
import { DeleteResult } from 'typeorm';

const mockUser = new MockUsersRepository().mockUser;
const mockCourse = new MockCourseRepository().mockCourse;

export class MockMemberRepository {
  readonly mockMember: Member = {
    memberId: 1,
    user: mockUser,
    course: mockCourse,
    memberCreatedAt: new Date(),
    memberUpdatedAt: new Date(),
  };
}

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;
  let courseService: CourseService;
  let lectureService: LectureService;

  const mockMember = new MockMemberRepository().mockMember;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            createMember: jest.fn(),
            findMemberDetail: jest.fn(),
            deleteMember: jest.fn(),
            findAllMembers: jest.fn(),
          },
        },
        {
          provide: CourseService,
          useValue: {
            findCourseDetail: jest.fn(),
          },
        },
        {
          provide: LectureService,
          useValue: {
            createLecturesForMember: jest.fn(),
            deleteLecturesForMember: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    courseService = module.get<CourseService>(CourseService);
    lectureService = module.get<LectureService>(LectureService);
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('createMember', () => {
    it('새로운 member가 등록될 시 그에 맞춰 lecture를 생성', async () => {
      const mockMemberDto: MemberDto = {
        userId: 1,
        courseId: 1,
      };

      jest
        .spyOn(courseService, 'findCourseDetail')
        .mockResolvedValue(mockCourse);
      jest
        .spyOn(memberRepository, 'createMember')
        .mockResolvedValue(mockMember);
      jest
        .spyOn(lectureService, 'createLecturesForMember')
        .mockResolvedValue(null);

      const result = await memberService.createMember(1, 1, mockMemberDto);

      expect(courseService.findCourseDetail).toHaveBeenCalledWith(1, 1);
      expect(memberRepository.createMember).toHaveBeenCalled();
      expect(lectureService.createLecturesForMember).toHaveBeenCalledWith(
        1,
        mockMember.user.userId,
        mockCourse.courseDays,
        mockCourse.courseStartTime,
        mockCourse.courseEndTime,
      );
      expect(result).toEqual(mockMember);
    });
  });

  describe('deleteMember', () => {
    it('member 등록 취소에 맞춰 생성되어 있던 lecture도 삭제 처리', async () => {
      (memberRepository.findMemberDetail as jest.Mock).mockResolvedValue(
        mockMember,
      );
      (memberRepository.deleteMember as jest.Mock).mockResolvedValue(
        DeleteResult,
      );
      (lectureService.deleteLecturesForMember as jest.Mock).mockResolvedValue(
        DeleteResult,
      );

      const result = await memberService.deleteMember(1, 1);

      expect(memberRepository.findMemberDetail).toHaveBeenCalledWith(1);
      expect(memberRepository.deleteMember).toHaveBeenCalledWith(1);
      expect(lectureService.deleteLecturesForMember).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('findAllMembers', () => {
    it('customer를 모두 조회해서 return', async () => {
      (memberRepository.findAllMembers as jest.Mock).mockResolvedValue([
        mockMember,
      ]);

      const result = await memberService.findAllMembers();

      expect(result).toEqual([mockMember]);
    });
  });
});
