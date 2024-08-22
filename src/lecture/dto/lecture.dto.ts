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

  @IsOptional()
  @IsString()
  readonly lectureQRCode: string;

  @IsOptional()
  @IsString()
  readonly lectureEndDate?: string;
}
