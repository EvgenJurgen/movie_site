import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

export class Appraiser {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: number;
}

@Schema()
export class Movie {
  @Prop()
  @ApiProperty()
  kinopoiskId: number;

  @Prop()
  @ApiProperty()
  totalRating: number;

  @Prop()
  @ApiProperty()
  numberOfAppraisers: number;

  @Prop()
  @ApiProperty({ type: [Appraiser] })
  appraisers: Appraiser[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ kinopoiskId: 1 }, { unique: true });
