import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @ApiProperty({ example: 'jwt.token' })
  tokenId: string;

  @IsString()
  @ApiProperty({ example: 'uuid4 token' })
  userId: string;
}
