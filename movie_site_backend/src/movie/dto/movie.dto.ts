import { ApiProperty } from '@nestjs/swagger';

class AppraiserDto {
  @ApiProperty({ example: 'user_id' })
  userId: string;

  @ApiProperty({ example: 10 })
  rating: number;
}

export class MovieDto {
  @ApiProperty({ example: 'mongodb document _id' })
  _id: string;

  @ApiProperty({ example: 0 })
  __v: number;

  @ApiProperty({ example: 404900 })
  kinopoiskId: number;

  @ApiProperty({ example: 10 })
  totalRating: number;

  @ApiProperty({ example: 1 })
  numberOfAppraisers: number;

  @ApiProperty({ type: [AppraiserDto] })
  appraisers: AppraiserDto[];
}
