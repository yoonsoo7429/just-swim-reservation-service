import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { LectureDto } from './dto/lecture.dto';
import { Lecture } from './entity/lecture.entity';
import * as QRCode from 'qrcode';
import { AwsService } from 'src/common/aws/aws.service';
import { MemberRepository } from 'src/member/member.repository';

@Injectable()
export class LectureService {
  constructor(
    private readonly awsService: AwsService,
    private readonly lectureRespository: LectureRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  /* lecture 생성 */
  async createLecture(
    userId: number,
    lectureDto: LectureDto,
  ): Promise<Lecture> {
    const newLecture = await this.lectureRespository.createLecture(lectureDto);

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
  async findAllLectures(userId: number, userType: string): Promise<Lecture[]> {
    if (userType === 'instructor') {
      return await this.lectureRespository.findAllLecturesByInstructor(userId);
    }

    if (userType === 'customer') {
      const lecturesByMember =
        await this.memberRepository.findAllLecturesByCustomer(userId);
      return lecturesByMember.map((member) => member.lecture);
    }
  }
}
