import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class AddRatingDto {
  @IsNumber()
  @ApiProperty({ example: 404900 })
  kinopoiskId: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty({ example: 10 })
  rating: number;
}
