import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateLectureDto {
  @IsNotEmpty()
  @IsNumber()
  readonly courseId: number;

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
