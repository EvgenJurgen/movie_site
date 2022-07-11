import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  @ApiProperty()
  tokenId: string;

  @Prop()
  @ApiProperty()
  userId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ tokenId: 1 }, { unique: true });
