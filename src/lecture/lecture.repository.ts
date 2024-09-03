import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { LessThan, MoreThan, Repository, UpdateResult } from 'typeorm';
import { LectureDto } from './dto/lecture.dto';
import { UpdateLectureDto } from './dto/updateLecture.dto';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  /* lecture 생성 */
  async createLecture(
    lectureDto: LectureDto,
    userId: number,
  ): Promise<Lecture> {
    const {
      lectureTitle,
      lectureContent,
      lectureStartTime,
      lectureEndTime,
      lectureDays,
      lectureEndDate,
    } = lectureDto;

    const lecture = new Lecture();
    lecture.user.userId = userId;
    lecture.lectureTitle = lectureTitle;
    lecture.lectureContent = lectureContent;
    lecture.lectureStartTime = lectureStartTime;
    lecture.lectureEndTime = lectureEndTime;
    lecture.lectureDays = lectureDays;
    lecture.lectureEndDate = lectureEndDate;
    await this.lectureRepository.save(lecture);

    return lecture;
  }

  /* QRCode 저장 */
  async saveQRCode(
    lectureId: number,
    lectureQRCode: string,
  ): Promise<UpdateResult> {
    return await this.lectureRepository.update(
      { lectureId },
      { lectureQRCode },
    );
  }

  /* 전체 강의 조회 (instructor) */
  async findAllLecturesByInstructor(userId: number): Promise<Lecture[]> {
    return await this.lectureRepository.find({
      where: { user: { userId }, lectureDeletedAt: null },
      relations: ['user'],
    });
  }

  /* 강의 상세 조회 */
  async findLectureDetail(lectureId: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({
      where: { lectureId, lectureDeletedAt: null },
      relations: ['user', 'member', 'attendance'],
    });
  }

  /* 강의 수정 */
  async updateLecture(
    lectureId: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<UpdateResult> {
    return await this.lectureRepository.update({ lectureId }, updateLectureDto);
  }

  /* 강의 삭제 (softDelete) */
  async softDeleteLecture(lectureId: number): Promise<UpdateResult> {
    return await this.lectureRepository.update(
      { lectureId },
      { lectureDeletedAt: new Date() },
    );
  }

  /* 겹치는 강습 확인 */
  async findLectureWithTimeConflict(
    userId: number,
    lectureDays: string,
    lectureStartTime: string,
    lectureEndTime: string,
  ): Promise<Lecture> {
    return await this.lectureRepository.findOne({
      where: {
        user: { userId },
        lectureDays,
        lectureStartTime: LessThan(lectureStartTime),
        lectureEndTime: MoreThan(lectureEndTime),
      },
    });
  }
}
