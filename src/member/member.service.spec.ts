import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Member } from './entity/member.entity';
import { Users } from 'src/users/entity/users.entity';
import { Lecture } from 'src/lecture/entity/lecture.entity';

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
  let service: MemberService;

  const mockMember = new MockMemberRespository().mockMember;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
