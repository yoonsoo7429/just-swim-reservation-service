import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { DeleteResult, Repository } from 'typeorm';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  /* member 등록 */
  async createMember(memberDto: MemberDto): Promise<Member> {
    const { userId, courseId } = memberDto;

    const member = this.memberRepository.create({
      user: { userId },
      course: { courseId },
    });
    await this.memberRepository.save(member);

    return member;
  }

  /* member 상세 조회 */
  async findMemberDetail(memberId: number): Promise<Member> {
    return await this.memberRepository.findOne({
      where: { memberId },
      relations: ['course', 'course.user', 'user'],
    });
  }

  /* member 등록 취소 */
  async deleteMember(memberId: number): Promise<DeleteResult> {
    return await this.memberRepository.delete({ memberId });
  }
}
