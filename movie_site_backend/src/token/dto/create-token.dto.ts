import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @ApiProperty({ example: 'uuid4 token id' })
  tokenId: string;

  @IsString()
  @ApiProperty({ example: 'user_id' })
  userId: string;
}
