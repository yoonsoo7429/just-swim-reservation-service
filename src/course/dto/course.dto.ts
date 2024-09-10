import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  readonly courseDays: string;

  @IsNotEmpty()
  @IsString()
  readonly courseStartTime: string;

  @IsNotEmpty()
  @IsString()
  readonly courseEndTime: string;

  @IsNotEmpty()
  @IsNumber()
  readonly courseCapacity: number;
}