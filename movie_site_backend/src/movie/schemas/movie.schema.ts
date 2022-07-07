import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop()
  kinopoiskId: number;

  @Prop()
  totalRating: number;

  @Prop()
  numberOfAppraisers: number;

  @Prop()
  appraisers: [
    {
      userId: string;
      rating: number;
    },
  ];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ kinopoiskId: 1 }, { unique: true });
