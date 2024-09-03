import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { LectureDto } from './dto/lecture.dto';
import { Lecture } from './entity/lecture.entity';
import * as QRCode from 'qrcode';
import { AwsService } from 'src/common/aws/aws.service';
import { MemberRepository } from 'src/member/member.repository';
import { UpdateLectureDto } from './dto/updateLecture.dto';

@Injectable()
export class LectureService {
  constructor(
    private readonly awsService: AwsService,
    private readonly lectureRespository: LectureRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  /* lecture 생성 */
  async createLecture(
    lectureDto: LectureDto,
    userId: number,
  ): Promise<Lecture> {
    // 동일한 시간대 확인
    const { lectureDays, lectureStartTime, lectureEndTime } = lectureDto;

    const existingLecture =
      await this.lectureRespository.findLectureWithTimeConflict(
        userId,
        lectureDays,
        lectureStartTime,
        lectureEndTime,
      );

    if (existingLecture) {
      throw new ConflictException('동일한 시간 대에 강의가 존재합니다.');
    }

    const newLecture = await this.lectureRespository.createLecture(
      lectureDto,
      userId,
    );

    // QR 생성
    const qrCodeData = await QRCode.toDataURL(
      `${process.env.SERVER_QR_CHECK_URI}?lectureId=${newLecture.lectureId}`,
    );
    const lectureQRCode = await this.awsService.uploadQRCodeToS3(
      newLecture.lectureId,
      qrCodeData,
    );

    const result = await this.lectureRespository.saveQRCode(
      newLecture.lectureId,
      lectureQRCode,
    );
    if (result.affected === 0) {
      throw new InternalServerErrorException(
        '강의 생성 중 qrcode 생성에 실패했습니다.',
      );
    }

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

    if (userType === 'customer') {
      const lecturesByMember =
        await this.memberRepository.findAllLecturesByCustomer(userId);
      return lecturesByMember.map((member) => member.lecture);
    }
  }

  /* 강의 상세 조회 */
  async findLectureDetail(userId: number, lectureId: number): Promise<Lecture> {
    const lecture = await this.lectureRespository.findLectureDetail(lectureId);
    // 강사 권한 확인
    if (lecture.user.userId === userId) {
      return lecture;
    }
    // 수강생 권한 확인
    if (lecture.member.some((member) => member.user.userId === userId)) {
      // 같은 멤버의 정보는 제외
      delete lecture.member;
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
