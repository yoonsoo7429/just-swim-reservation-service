import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  readonly courseTitle: string;

  @IsOptional()
  @IsString()
  readonly courseDays: string;

  @IsOptional()
  @IsString()
  readonly courseStartTime: string;

  @IsOptional()
  @IsString()
  readonly courseEndTime: string;

  @IsOptional()
  @IsNumber()
  readonly courseCapacity: number;
}
