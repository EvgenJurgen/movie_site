import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test_email@gmail.com' })
  readonly email: string;

  @IsString()
  @Length(6, 20)
  @ApiProperty({ example: 'test_password' })
  readonly password: string;
}
