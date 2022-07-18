import { ApiProperty } from '@nestjs/swagger';

export class RemoveRatingDto {
  @ApiProperty({ example: 404900 })
  kinopoiskId: number;
}
