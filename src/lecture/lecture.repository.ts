import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import * as moment from 'moment';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  /* member 등록에 맞춰 강의 생성 */
  async createLecturesForMember(
    lecturesToCreate: Partial<Lecture>[],
  ): Promise<Lecture[]> {
    const lectures = lecturesToCreate.map((lecture) =>
      this.lectureRepository.create(lecture),
    );

    return await this.lectureRepository.save(lectures);
  }

  /* member 등록 취소에 맞춰 강의 삭제 */
  async deleteLecturesForMember(
    courseId: number,
    userId: number,
  ): Promise<DeleteResult> {
    return await this.lectureRepository.delete({
      course: { courseId },
      user: { userId },
    });
  }

  /* lecture 상세 조회 */
  async findLectureDetail(lectureId: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({
      where: { lectureId },
      relations: ['course', 'course.user', 'user'],
    });
  }

  /* 강의 업데이트 */
  async updateLecture(
    userId: number,
    lectureId: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<UpdateResult> {
    const { courseId, lectureDate, lectureStartTime, lectureEndTime } =
      updateLectureDto;
    return await this.lectureRepository.update(
      { lectureId, user: { userId } },
      { lectureDate, lectureStartTime, lectureEndTime, course: { courseId } },
    );
  }

  /* 매일 자정에 지난 강의는 DeletedAt으로 처리 해주기 */
  async expirePastLectures(today: string): Promise<UpdateResult> {
    return await this.lectureRepository
      .createQueryBuilder()
      .update(Lecture)
      .set({ lectureDeletedAt: moment().toDate() })
      .where('lectureDate < :today', { today })
      .andWhere('lectureDeletedAt IS NULL')
      .execute();
  }

  /* 달력에 맞춰 강좌 조회(customer) */
  async findAllCoursesForScheduleByCustomer(
    userId: number,
  ): Promise<Lecture[]> {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    return await this.lectureRepository
      .createQueryBuilder('lecture')
      .leftJoinAndSelect('lecture.user', 'user')
      .leftJoinAndSelect('lecture.course', 'course')
      .leftJoinAndSelect('user.customer', 'customer')
      .leftJoinAndSelect('course.user', 'courseUser')
      .where('lecture.userId = :userId', { userId })
      .andWhere('lecture.lectureDate BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth,
        endOfMonth,
      })
      .getMany();
  }
}
