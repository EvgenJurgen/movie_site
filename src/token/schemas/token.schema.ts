import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  @ApiProperty({ example: 'uuid4 token id' })
  tokenId: string;

  @Prop()
  @ApiProperty({ example: 1000000000 })
  exp: number;

  @Prop()
  @ApiProperty({ example: 'user_id' })
  userId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ tokenId: 1 }, { unique: true });
