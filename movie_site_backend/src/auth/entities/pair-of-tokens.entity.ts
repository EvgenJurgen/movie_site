import { ApiProperty } from '@nestjs/swagger';
import { PairOfTokensInterface } from '../interfaces/pair-of-tokens.interface';

export class PairOfTokens implements PairOfTokensInterface {
  @ApiProperty({ example: 'some_kind_of_jwt_access_token' })
  accessToken: string;

  @ApiProperty({ example: 'some_kind_of_jwt_refresh_token' })
  refreshToken: string;
}
