import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUser } from '../common/decorators';
import { AddRatingDto } from './dto/add-rating.dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/:title')
  async getFilmsIdByTitle(@Param('title') title: string) {
    return await this.movieService.getFilmsIdByTitle(title);
  }

  @Get('/about-film/:id')
  async getInformationAboutTheFilmById(@Param('id') filmId: number) {
    return await this.movieService.getInformationAboutTheFilmById(filmId);
  }

  @Get('/:id/about-seasons')
  async getInformationAboutSeasonsBySerialId(@Param('id') serialId: number) {
    return await this.movieService.getInformationAboutSeasonsBySerialId(
      serialId,
    );
  }

  @Post('/add-rating')
  async addARatingToAFilm(
    @Body() addRatingDto: AddRatingDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.movieService.addARatingToAFilm(userId, addRatingDto);
  }

  @Get('/:id/get-rating')
  async getARatingByKinopoiskId(@Param('id') kinopoiskId: number) {
    return await this.movieService.getARatingByKinopoiskId(kinopoiskId);
  }

  @Post('/remove-rating')
  async removeRatingFromAFilm(
    @Body('kinopoiskId') kinopoiskId: number,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.movieService.removeARatingByKinopoiskIdAndUserId(
      kinopoiskId,
      userId,
    );
  }
}
