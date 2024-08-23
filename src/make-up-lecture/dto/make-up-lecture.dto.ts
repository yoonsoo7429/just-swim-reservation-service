import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MakeUpLectureDto {
  @IsNotEmpty()
  @IsNumber()
  readonly lectureId: number;

  @IsNotEmpty()
  @IsString()
  readonly makeUpLectureDay: string;

  @IsNotEmpty()
  @IsString()
  readonly makeUpLectureTime: string;
}
