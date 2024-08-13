import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { LectureDto } from './dto/lecture.dto';
import { Lecture } from './entity/lecture.entity';
import * as QRCode from 'qrcode';
import { AwsService } from 'src/common/aws/aws.service';

@Injectable()
export class LectureService {
  constructor(
    private readonly awsService: AwsService,
    private readonly lectureRespository: LectureRepository,
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
      throw new InternalServerErrorException('qrcode 생성에 실패했습니다.');
    }

    return newLecture;
  }
}
