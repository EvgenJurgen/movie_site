import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    exp: number,
    userId: string,
  ): Promise<TokenDocument> {
    console.log(tokenId, exp, userId);
    const createdToken = new this.tokenModel({ tokenId, exp, userId });
    return await createdToken.save();
  }

  async replaceDbRefreshToken(
    tokenId: string,
    exp: number,
    userId: string,
  ): Promise<TokenDocument> {
    await this.tokenModel.findOneAndRemove({ userId });
    return await this.tokenModel.create({ tokenId, exp, userId });
  }

  async removeDbRefreshTokenByTokenId(tokenId: string): Promise<TokenDocument> {
    return await this.tokenModel.findOneAndRemove({ tokenId });
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async delitingExpiredTokens(): Promise<void> {
    await this.tokenModel.deleteMany({ exp: { $lt: Date.now() / 1000 } });
  }
}
