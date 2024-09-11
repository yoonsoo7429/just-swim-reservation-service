import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { LectureDto } from './dto/lecture.dto';
import { Lecture } from './entity/lecture.entity';
import { UpdateLectureDto } from './dto/updateLecture.dto';

@Injectable()
export class LectureService {
  constructor(private readonly lectureRespository: LectureRepository) {}

  /* lecture 생성 */
  async createLecture(
    lectureDto: LectureDto,
    userId: number,
  ): Promise<Lecture> {
    const newLecture = await this.lectureRespository.createLecture(
      lectureDto,
      userId,
    );

    return newLecture;
  }

  /* 전체 강의 조회 */
  async findAllLecturesForSchedule(
    userId: number,
    userType: string,
  ): Promise<Lecture[]> {
    if (userType === 'instructor') {
      return await this.lectureRespository.findAllLecturesByInstructor(userId);
    }
  }

  /* 강의 상세 조회 */
  async findLectureDetail(userId: number, lectureId: number): Promise<Lecture> {
    const lecture = await this.lectureRespository.findLectureDetail(lectureId);
    // 강사 권한 확인
    if (lecture.user.userId === userId) {
      return lecture;
    }

    throw new UnauthorizedException('강의 상세 조회 권한이 없습니다.');
  }

  /* 강의 수정 */
  async updateLecture(
    userId: number,
    lectureId: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<void> {
    const lecture = await this.lectureRespository.findLectureDetail(lectureId);
    // 권한 확인
    if (lecture.user.userId !== userId) {
      throw new UnauthorizedException('강의 수정 권한이 없습니다.');
    }

    // 강의 수정
    const updateResult = await this.lectureRespository.updateLecture(
      lectureId,
      updateLectureDto,
    );

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('강의 수정 실패');
    }
  }

  /* 강의 삭제 (softDelete) */
  async softDeleteLecture(userId: number, lectureId: number): Promise<void> {
    const lecture = await this.lectureRespository.findLectureDetail(lectureId);
    // 권한 확인
    if (lecture.user.userId !== userId) {
      throw new UnauthorizedException('강의 삭제 권한이 없습니다.');
    }

    // 강의 삭제
    const softDeleteResult =
      await this.lectureRespository.softDeleteLecture(lectureId);

    if (softDeleteResult.affected === 0) {
      throw new InternalServerErrorException('강의 삭제 실패');
    }
  }
}
