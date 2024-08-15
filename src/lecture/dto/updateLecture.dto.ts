import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  readonly lectureTitle: string;

  @IsOptional()
  @IsString()
  readonly lectureContent: string;

  @IsOptional()
  @IsString()
  readonly lectureTime: string;

  @IsOptional()
  @IsString()
  readonly lectureDays: string;

  @IsOptional()
  @IsString()
  readonly lectureQRCode: string;

  @IsOptional()
  @IsString()
  readonly lectureEndDate: string;
}