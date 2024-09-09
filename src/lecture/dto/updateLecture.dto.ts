import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  readonly lectureDate?: string;

  @IsOptional()
  @IsString()
  readonly lectureStartTime?: string;

  @IsOptional()
  @IsString()
  readonly lectureEndTime?: string;

  @IsOptional()
  @IsString()
  readonly lectureAttendee?: string;
}
