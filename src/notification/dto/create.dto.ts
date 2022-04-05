import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number

  @IsNumber()
  brandId: number

  @IsNumber()
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
  type: string

  @IsString()
  @IsNotEmpty()
  message: string 
}