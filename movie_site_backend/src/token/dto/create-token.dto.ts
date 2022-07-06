import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  tokenId: string;

  @IsString()
  userId: string;
}
