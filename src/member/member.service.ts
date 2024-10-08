import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/member.dto';
import { Member } from './entity/member.entity';
import { CourseService } from 'src/course/course.service';
import { LectureService } from 'src/lecture/lecture.service';
import { DeleteResult } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly courseService: CourseService,
    private readonly lectureService: LectureService,
  ) {}

  /* instructor의 권한으로 customer를 member로 등록 */
  async createMember(
    courseId: number,
    userId: number,
    memberDto: MemberDto,
  ): Promise<Member> {
    // course 정보를 통해 권한 확인
    const course = await this.courseService.findCourseDetail(courseId, userId);

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
    const memberUserId = member.user.userId;
    const lectureDays = course.courseDays;
    const lectureStartTime = course.courseStartTime;
    const lectureEndTime = course.courseEndTime;

    await this.lectureService.createLecturesForMember(
      courseId,
      memberUserId,
      lectureDays,
      lectureStartTime,
      lectureEndTime,
    );

    return member;
  }

  /* instructor가 수강생 등록 취소 */
  async deleteMember(memberId: number, userId: number): Promise<DeleteResult> {
    const member = await this.memberRepository.findMemberDetail(memberId);

    if (!member) {
      throw new NotFoundException('수강생 정보를 찾을 수 없습니다.');
    }
    const instructorUserId = member.course.user.userId;
    if (instructorUserId !== userId) {
      throw new UnauthorizedException('수강생 등록 취소 권한이 없습니다.');
    }

    const deleteResult = await this.memberRepository.deleteMember(memberId);
    if (deleteResult.affected === 0) {
      throw new InternalServerErrorException(
        '수강생 등록 취소를 실패했습니다.',
      );
    }

    const courseId = member.course.courseId;
    const customerUserId = member.user.userId;
    await this.lectureService.deleteLecturesForMember(courseId, customerUserId);

    return deleteResult;
  }

  /* 모든 member 조회 */
  async findAllMembers(): Promise<Member[]> {
    return await this.memberRepository.findAllMembers();
  }
}
