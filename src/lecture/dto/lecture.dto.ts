import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LectureDto {
  @IsNotEmpty()
  @IsString()
  readonly lectureDate: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureStartTime: string;

  @IsNotEmpty()
  @IsString()
  readonly lectureEndTime: string;
}
