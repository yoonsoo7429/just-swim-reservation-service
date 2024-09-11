import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/member.dto';
import { Member } from './entity/member.entity';
import { CourseRepository } from 'src/course/course.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  /* instructor의 권한으로 customer를 member로 등록 */
  async createMember(
    courseId: number,
    userId: number,
    memberDto: MemberDto,
  ): Promise<Member> {
    // course 정보를 통해 권한 확인
    const course = await this.courseRepository.findCourseDetail(courseId);
    if (course.user.userId !== userId) {
      throw new UnauthorizedException('고객을 강좌에 등록할 권한이 없습니다.');
    }

    return await this.memberRepository.createMember(memberDto);
  }
}
