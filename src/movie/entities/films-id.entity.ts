import { ApiProperty } from '@nestjs/swagger';
import { FilmsIdInterface } from '../interfaces/films-id.interface';

export class FilmsId implements FilmsIdInterface {
  @ApiProperty({ type: [Number], example: [404900, 1209193, 1047881, 754975] })
  filmsId: number[];
}
