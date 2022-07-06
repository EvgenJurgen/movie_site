import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  tokenId: string;

  @Prop()
  userId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ tokenId: 1 }, { unique: true });
