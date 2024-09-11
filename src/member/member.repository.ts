import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { Repository } from 'typeorm';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  /* member 등록 */
  async createMember(memberDto: MemberDto): Promise<Member> {
    const { userId, courseId } = memberDto;

    const member = new Member();
    member.user.userId = userId;
    member.course.courseId = courseId;
    await this.memberRepository.save(member);

    return member;
  }
}
