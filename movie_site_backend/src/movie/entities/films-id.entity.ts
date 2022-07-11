import { ApiProperty } from '@nestjs/swagger';
import { FilmsIdInterface } from '../interfaces/films-id.interface';

export class FilmsId implements FilmsIdInterface {
  @ApiProperty({ type: [Number] })
  filmsId: number[];
}
