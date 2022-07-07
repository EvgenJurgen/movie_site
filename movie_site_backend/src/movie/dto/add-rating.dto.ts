import { IsNumber, Max, Min } from 'class-validator';

export class AddRatingDto {
  @IsNumber()
  kinopoiskId: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}
