import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from '../common/decorators';
import { AddRatingDto } from './dto/add-rating.dto';
import { RemoveRatingDto } from './dto/remove-rating.dto';
import { FilmsId } from './entities/films-id.entity';
import { FilmsIdInterface } from './interfaces/films-id.interface';
import { MovieService } from './movie.service';
import { Movie, MovieDocument } from './schemas/movie.schema';

@ApiTags('movie')
@Controller('movie')
@ApiBearerAuth('access-token')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/:title')
  @ApiOkResponse({
    description: 'Getting the kinopoisk id of movies by title',
    type: FilmsId,
  })
  async getFilmsIdByTitle(
    @Param('title') title: string,
  ): Promise<FilmsIdInterface> {
    return await this.movieService.getFilmsIdByTitle(title);
  }

  @Get('/about-film/:id')
  @ApiOkResponse({
    description: 'Getting information about a movie by kinopoisk id',
  })
  async getInformationAboutTheFilmById(@Param('id') filmId: number) {
    return await this.movieService.getInformationAboutTheFilmById(filmId);
  }

  @Get('/:id/about-seasons')
  @ApiOkResponse({
    description:
      'Getting information about the seasons of the series by kinopoisk id',
  })
  async getInformationAboutSeasonsBySerialId(@Param('id') serialId: number) {
    return await this.movieService.getInformationAboutSeasonsBySerialId(
      serialId,
    );
  }

  @Post('/add-rating')
  @ApiCreatedResponse({
    description: 'Adding a movie rating to the database by kinopoisk id',
    type: Movie,
  })
  async addARatingToAFilm(
    @Body() addRatingDto: AddRatingDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<MovieDocument> {
    return await this.movieService.addARatingToAFilm(userId, addRatingDto);
  }

  @Get('/:id/get-rating')
  @ApiOkResponse({
    description: 'Getting a movie rating from a database by kinopoisk id',
    type: Movie,
  })
  async getARatingByKinopoiskId(
    @Param('id') kinopoiskId: number,
  ): Promise<MovieDocument> {
    return await this.movieService.getARatingByKinopoiskId(kinopoiskId);
  }

  @Delete('/remove-rating')
  @ApiOkResponse({
    description: "Deleting a user's rating about a movie from the database",
    type: Movie,
  })
  async removeRatingFromAFilm(
    @Body() removeRatingDto: RemoveRatingDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<MovieDocument> {
    return await this.movieService.removeARatingByKinopoiskIdAndUserId(
      removeRatingDto.kinopoiskId,
      userId,
    );
  }
}
