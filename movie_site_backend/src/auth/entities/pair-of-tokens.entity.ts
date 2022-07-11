import { ApiProperty } from '@nestjs/swagger';
import { PairOfTokensInterface } from '../interfaces/pair-of-tokens.interface';

export class PairOfTokens implements PairOfTokensInterface {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
