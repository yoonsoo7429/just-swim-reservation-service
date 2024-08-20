import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { Member } from './entity/member.entity';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /* 강의에 해당하는 수강생 목록 조회 */
  async findAllMembersByLectureId(lectureId: number): Promise<Member[]> {
    return await this.memberRepository.findAllMembersByLectureId(lectureId);
  }
}
