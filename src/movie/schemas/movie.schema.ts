import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

export class Appraiser {
  @ApiProperty({ example: 'user_id' })
  userId: string;

  @ApiProperty({ example: 10 })
  rating: number;
}

@Schema()
export class Movie {
  @Prop()
  @ApiProperty({ example: 404900 })
  kinopoiskId: number;

  @Prop()
  @ApiProperty({ example: 10 })
  totalRating: number;

  @Prop()
  @ApiProperty({ example: 1 })
  numberOfAppraisers: number;

  @Prop()
  @ApiProperty({ type: [Appraiser] })
  appraisers: Appraiser[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ kinopoiskId: 1 }, { unique: true });
