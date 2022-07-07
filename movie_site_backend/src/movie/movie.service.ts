import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddRatingDto } from './dto/add-rating.dto';
import { Movie, MovieDocument } from './schemas/movie.schema';
import * as _ from 'lodash';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async getFilmsIdByTitle(title: string): Promise<{ filmsId: number[] }> {
    const response = await this.httpService.axiosRef.get(
      `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(
        title,
      )}`,
      {
        headers: {
          'X-API-KEY': 'e2acd2c1-ca72-49dc-991e-5425ae06b875',
          'Content-Type': 'application/json',
        },
      },
    );

    return { filmsId: response.data.films.map((film) => film.filmId) };
  }

  async getInformationAboutTheFilmById(filmId: number) {
    const response = await this.httpService.axiosRef.get(
      `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`,
      {
        headers: {
          'X-API-KEY': 'e2acd2c1-ca72-49dc-991e-5425ae06b875',
          'Content-Type': 'application/json',
        },
      },
    );

    const data = response.data;

    console.log(data);

    return data;
  }

  async getInformationAboutSeasonsBySerialId(serialId: number) {
    const response = await this.httpService.axiosRef.get(
      `https://kinopoiskapiunofficial.tech/api/v2.2/films/${serialId}/seasons`,
      {
        headers: {
          'X-API-KEY': 'e2acd2c1-ca72-49dc-991e-5425ae06b875',
          'Content-Type': 'application/json',
        },
      },
    );

    const data = response.data;

    return data;
  }

  async addARatingToAFilm(
    userId: string,
    addRatingDto: AddRatingDto,
  ): Promise<MovieDocument> {
    const film = await this.movieModel.findOne({
      kinopoiskId: addRatingDto.kinopoiskId,
    });

    if (!film) {
      const newFilmDocument = await this.movieModel.create({
        kinopoiskId: addRatingDto.kinopoiskId,
        totalRating: addRatingDto.rating,
        numberOfAppraisers: 1,
        appraisers: [{ userId, rating: addRatingDto.rating }],
      });
      return newFilmDocument;
    } else {
      const currentUserRatedThisFilm = film.appraisers.some(
        (appraiser) => appraiser.userId === userId,
      );
      if (currentUserRatedThisFilm) {
        const { rating: previousRating } = film.appraisers.find(
          (appraiser) => appraiser.userId === userId,
        );

        _.assignIn(film, {
          totalRating: film.totalRating - previousRating + addRatingDto.rating,
          numberOfAppraisers: film.numberOfAppraisers,
          appraisers: film.appraisers.map((appraiser) => {
            if (appraiser.userId === userId) {
              return { ...appraiser, rating: addRatingDto.rating };
            } else {
              return appraiser;
            }
          }),
        });

        await film.save();

        return film;
      } else {
        _.assignIn(film, {
          totalRating: film.totalRating + addRatingDto.rating,
          numberOfAppraisers: film.numberOfAppraisers + 1,
          // appraisers: film.appraisers.push({
          //   userId,
          //   rating: addRatingDto.rating,
          // }),
          appraisers: [
            ...film.appraisers,
            { userId, rating: addRatingDto.rating },
          ],
        });

        await film.save();

        return film;
      }
    }
  }

  async getARatingByKinopoiskId(kinopoiskId: number): Promise<MovieDocument> {
    return await this.movieModel.findOne({ kinopoiskId });
  }

  async removeARatingByKinopoiskIdAndUserId(
    kinopoiskId: number,
    userId: string,
  ) {
    const film = await this.movieModel.findOne({ kinopoiskId });

    if (!film) {
      throw new ForbiddenException('The rating of this film not found');
    }

    const appraiser = film.appraisers.find(
      (appraiser) => appraiser.userId === userId,
    );

    if (!appraiser) {
      return film;
    }

    console.log(film.totalRating, appraiser.rating);

    _.assignIn(film, {
      totalRating: film.totalRating - appraiser.rating,
      numberOfAppraisers: film.numberOfAppraisers - 1,
      appraisers: film.appraisers.filter(
        (appraiser) => appraiser.userId !== userId,
      ),
    });

    await film.save();

    return film;
  }
}
