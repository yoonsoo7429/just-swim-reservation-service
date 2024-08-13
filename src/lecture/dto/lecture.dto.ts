import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LectureDto {
  @IsNotEmpty()
  @IsString()
  readonly lectureTitle: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureContent: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureTime: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureDays: string;

  @IsNotEmpty()
  @IsOptional()
  readonly lectureQRCode: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureEndDate: string;
}
