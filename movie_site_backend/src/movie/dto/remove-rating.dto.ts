import { ApiProperty } from '@nestjs/swagger';

export class RemoveRatingDto {
  @ApiProperty()
  kinopoiskId: number;
}
