import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async findById(tokenId: string): Promise<TokenDocument> {
    return await this.tokenModel.findOne({ tokenId });
  }

  async saveDbRefreshToken(
    tokenId: string,
    userId: string,
  ): Promise<TokenDocument> {
    console.log(tokenId, userId);
    const createdToken = new this.tokenModel({ tokenId, userId });
    return await createdToken.save();
  }

  async replaceDbRefreshToken(
    tokenId: string,
    userId: string,
  ): Promise<TokenDocument> {
    await this.tokenModel.findOneAndRemove({ userId });
    return await this.tokenModel.create({ tokenId, userId });
  }

  async removeDbRefreshTokenByTokenId(tokenId: string): Promise<TokenDocument> {
    return await this.tokenModel.findOneAndRemove({ tokenId });
  }
}
