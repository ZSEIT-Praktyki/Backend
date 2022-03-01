import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
