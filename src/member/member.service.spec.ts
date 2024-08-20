import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Member } from './entity/member.entity';
import { Users } from 'src/users/entity/users.entity';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { MemberRepository } from './member.repository';

export class MockMemberRespository {
  readonly mockMember: Member = {
    memberId: 1,
    user: new Users(),
    lecture: new Lecture(),
    memberNickname: '홍당무 아버지 홍길동',
    memberCreatedAt: new Date(),
    memberUpdatedAt: new Date(),
    memberDeletedAt: null,
  };
}

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;

  const mockMember = new MockMemberRespository().mockMember;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            findAllLecturesByCustomer: jest.fn(),
            findAllMembersByLectureId: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });
  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('findAllMembersByLectureId', () => {
    it('lectureId에 해당하는 member를 모두 조회하여 return', async () => {
      const lectureId = 1;
      jest
        .spyOn(memberRepository, 'findAllMembersByLectureId')
        .mockResolvedValue([mockMember]);

      const result = await memberService.findAllMembersByLectureId(lectureId);

      expect(result).toEqual([mockMember]);
      expect(memberRepository.findAllMembersByLectureId).toHaveBeenCalledWith(
        lectureId,
      );
    });
  });
});
