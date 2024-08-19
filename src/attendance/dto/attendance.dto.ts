import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AttendanceDto {
  @IsNotEmpty()
  @IsString()
  readonly attendanceDay: string;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly lectureId: number;
}
