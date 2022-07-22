import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from '../common/decorators';
import { AccessTokenGuard } from '../common/guards';
import { AddRatingDto } from './dto/add-rating.dto';
import { MovieDto } from './dto/movie.dto';
import { RemoveRatingDto } from './dto/remove-rating.dto';
import { FilmsId } from './entities/films-id.entity';
import { FilmsIdInterface } from './interfaces/films-id.interface';
import { MovieService } from './movie.service';
import { MovieDocument } from './schemas/movie.schema';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/top')
  async getTopFilms(@Query('page') page: number) {
    return this.movieService.getTopFilms(page);
  }

  @Get('/:title')
  @ApiOkResponse({
    description: 'Getting the kinopoisk id of movies by title',
    type: FilmsId,
  })
  async getFilmsIdByTitle(
    @Param('title') title: string,
  ): Promise<FilmsIdInterface> {
    return this.movieService.getFilmsIdByTitle(title);
  }

  @Get('/about-film/:id')
  @ApiOkResponse({
    description: 'Getting information about a movie by kinopoisk id',
  })
  async getInformationAboutTheFilmById(@Param('id') filmId: number) {
    return this.movieService.getInformationAboutTheFilmById(filmId);
  }

  @Get('/:id/about-seasons')
  @ApiOkResponse({
    description:
      'Getting information about the seasons of the series by kinopoisk id',
  })
  async getInformationAboutSeasonsBySerialId(@Param('id') serialId: number) {
    return this.movieService.getInformationAboutSeasonsBySerialId(serialId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @Post('/add-rating')
  @ApiCreatedResponse({
    description: 'Adding a movie rating to the database by kinopoisk id',
    type: MovieDto,
  })
  async addARatingToAFilm(
    @Body() addRatingDto: AddRatingDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<MovieDocument> {
    return this.movieService.addARatingToAFilm(userId, addRatingDto);
  }

  @Get('/:id/get-rating')
  @ApiOkResponse({
    description: 'Getting a movie rating from a database by kinopoisk id',
    type: MovieDto,
  })
  async getARatingByKinopoiskId(
    @Param('id') kinopoiskId: number,
  ): Promise<MovieDocument> {
    return this.movieService.getARatingByKinopoiskId(kinopoiskId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @Delete('/remove-rating')
  @ApiOkResponse({
    description: "Deleting a user's rating about a movie from the database",
    type: MovieDto,
  })
  async removeRatingFromAFilm(
    @Body() removeRatingDto: RemoveRatingDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<MovieDocument> {
    return this.movieService.removeARatingByKinopoiskIdAndUserId(
      removeRatingDto.kinopoiskId,
      userId,
    );
  }
}
