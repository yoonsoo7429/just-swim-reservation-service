import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InstructorDto {
  @IsNotEmpty()
  @IsString()
  readonly instructorName: string;

  @IsNotEmpty()
  @IsString()
  readonly instructorPhoneNumber: string;

  @IsOptional()
  @IsString()
  readonly instructorProfileImage?: string;
}
