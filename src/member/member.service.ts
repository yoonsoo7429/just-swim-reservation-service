import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/member.dto';
import { Member } from './entity/member.entity';
import { CourseRepository } from 'src/course/course.repository';
import { LectureRepository } from 'src/lecture/lecture.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly courseRepository: CourseRepository,
    private readonly lectureRepository: LectureRepository,
  ) {}

  /* instructor의 권한으로 customer를 member로 등록 */
  async createMember(
    courseId: number,
    userId: number,
    memberDto: MemberDto,
  ): Promise<Member> {
    // course 정보를 통해 권한 확인
    const course = await this.courseRepository.findCourseDetail(courseId);

    // course가 있는지 확인
    if (!course) {
      throw new NotFoundException('해당 강좌를 확인할 수 없습니다.');
    }
    // course.user가 잘 불러와졌는지 확인
    if (course.user.userId !== userId) {
      throw new UnauthorizedException('고객을 강좌에 등록할 권한이 없습니다.');
    }
    // member 수와 수용 가능 인원 확인
    const memberCount = course.member ? course.member.length : 0;
    if (course.courseCapacity === memberCount) {
      throw new ConflictException('강좌에 등록할 수 있는 인원이 가득찼습니다.');
    }

    const member = await this.memberRepository.createMember(memberDto);

    // member를 등록하면 lecture도 오늘 날짜 이후로 생성함

    return member;
  }
}
