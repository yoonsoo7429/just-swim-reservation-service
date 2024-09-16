import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import * as moment from 'moment';
import { DeleteResult } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MemberRepository } from 'src/member/member.repository';

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  /* instructor가 customer를 member로 등록과 동시에 오늘 날짜 이후로 lecture 생성 */
  async createLecturesForMember(
    courseId: number,
    userId: number,
    lectureDays: string,
    lectureStartTime: string,
    lectureEndTime: string,
  ) {
    // 오늘 날짜를 기준으로 이번달 lecture에 들어갈 lectureDate를 계산
    // 오늘 날짜 가져오기
    const today = moment();
    // lectureDays를 배열로 분리
    const daysOfWeek = lectureDays.split(',');

    // 현재 달의 모든 날짜 중에서 강의 날짜 필터링
    const lecturesToCreate = [];

    for (let i = 0; i < 30; i++) {
      const date = today.clone().add(i, 'days');
      const dayName = date.format('dddd');

      if (daysOfWeek.includes(dayName) && date.isAfter(today)) {
        lecturesToCreate.push({
          lectureDate: date.format('YYYY-MM-DD'),
          lectureStartTime,
          lectureEndTime,
          user: { userId },
          course: { courseId },
        });
      }
    }

    // LectureRepository에서 강의 생성
    const lectures =
      await this.lectureRepository.createLecturesForNewMember(lecturesToCreate);

    return lectures;
  }

  /* instructor의 수강생 등록 취소에 맞춰 강의 삭제 */
  async deleteLecturesForMember(
    courseId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const deleteResult = await this.lectureRepository.deleteLecturesForMember(
      courseId,
      userId,
    );

    if (deleteResult.affected === 0) {
      throw new InternalServerErrorException('강의 삭제를 실패했습니다.');
    }

    return deleteResult;
  }

  /* 매달 첫 날, member에 맞춰 다음 달 강의 생성 */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async createLecturesForNextMonth(): Promise<void> {
    const nextMonth = moment().add(1, 'month').startOf('month');

    // 모든 활성화된 member와 해당 강좌 조회
    const allMembers = await this.memberRepository.findAllMembers();

    const lecturesToCreate = [];

    allMembers.forEach((member) => {
      const { course, user } = member;
      const daysOfWeek = course.courseDays.split(',');

      // 다음 달 일정에 맞춰 강의 생성
      for (let i = 0; i < nextMonth.daysInMonth(); i++) {
        const date = nextMonth.clone().add(i, 'days');
        const dayName = date.format('dddd');

        if (daysOfWeek.includes(dayName)) {
          lecturesToCreate.push({
            lectureDate: date.format('YYYY-MM-DD'),
            lectureStartTime: course.courseStartTime,
            lectureEndTime: course.courseEndTime,
            user: { userId: user.userId },
            course: { courseId: course.courseId },
          });
        }
      }
    });

    // 생성한 강의가 있으면 DB에 저장
    if (lecturesToCreate.length > 0) {
      await this.lectureRepository.createLecturesForNewMember(lecturesToCreate);
    }
  }
}
