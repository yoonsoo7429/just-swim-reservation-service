import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/entity/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  /* 전체 강의 조회 (customer) */
  async findAllLecturesByCustomer(userId: number): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { user: { userId } },
      relations: ['lecture'],
    });
  }

  /* 강의에 해당하는 수강생 목록 조회 */
  async findAllMembersByLectureId(lectureId: number): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { lecture: { lectureId } },
      relations: ['lecture'],
    });
  }
}
