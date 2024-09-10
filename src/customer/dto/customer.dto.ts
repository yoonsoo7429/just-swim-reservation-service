import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  readonly customerName: string;

  @IsOptional()
  @IsString()
  readonly customerProfileImage?: string;

  @IsOptional()
  @IsString()
  readonly customerEnrollment?: string;

  @IsNotEmpty()
  @IsString()
  readonly customerBirth: string;

  @IsNotEmpty()
  @IsString()
  readonly customerPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly customerGender: string;

  @IsNotEmpty()
  @IsString()
  readonly customerAddress: string;
}