import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserType } from '../enum/userType.enum';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  readonly provider: string;

  @IsOptional()
  @IsEnum(UserType)
  readonly userType?: UserType;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly profileImage?: string;

  @IsOptional()
  @IsString()
  readonly birth: string;

  @IsOptional()
  @IsString()
  readonly phoneNumber: string;
}
