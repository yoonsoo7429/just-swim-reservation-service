import { Injectable } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import * as moment from 'moment';

@Injectable()
export class LectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  /* instructor가 customer를 member로 등록과 동시에 오늘 날짜 이후로 lecture 생성 */
  async createLecturesForNewMember(
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
}
