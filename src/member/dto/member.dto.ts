import { IsNotEmpty, IsNumber } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly courseId: number;
}
