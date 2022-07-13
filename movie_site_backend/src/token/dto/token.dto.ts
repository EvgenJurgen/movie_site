import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ example: 'mongodb document _id' })
  _id: string;

  @ApiProperty({ example: 0 })
  __v: number;

  @ApiProperty({ example: 'uuid4 token id' })
  tokenId: string;

  @ApiProperty({ example: 1000000000 })
  exp: number;

  @ApiProperty({ example: 'user_id' })
  userId: string;
}
