import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsOptional()
  userId: number

  @IsNumber()
  @IsOptional()
  brandId: number

  @IsNumber()
  @IsOptional()
  companyId: number

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsIn(['NOTI_USER', 'NOTI_BRAND', 'NOTI_COMPANY'])
  type: string

  @IsString()
  @IsNotEmpty()
  message: string 
}