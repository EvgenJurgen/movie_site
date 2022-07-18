import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'mongodb document _id' })
  _id: string;

  @ApiProperty({ example: 0 })
  __v: number;

  @ApiProperty({ example: 'test_email@gmail.com' })
  email: string;

  @ApiProperty({ example: 'hashed test_password' })
  password: string;
}
