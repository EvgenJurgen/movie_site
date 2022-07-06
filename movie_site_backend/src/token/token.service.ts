import jwt from 'jsonwebtoken';
// import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { tokens } from './constants/tokensOptions';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  // async generateAccessToken(userId: string) {
  //   const payload = {
  //     userId,
  //     type: tokens.access.type,
  //   };

  //   const options = { expiresIn: tokens.access.expriresIn };

  //   return jwt.sign(payload, process.env.JWT_SECRET, options);
  // }

  // async generateRefreshToken() {
  //   const payload = {
  //     id: uuidv4(),
  //     type: tokens.refresh.type,
  //   };

  //   const options = { expiresIn: tokens.refresh.expriresIn };

  //   return {
  //     id: payload.id,
  //     token: jwt.sign(payload, process.env.JWT_SECRET, options),
  //   };
  // }

  async findById(tokenId: string) {
    return await this.tokenModel.findOne({ tokenId });
  }

  async saveDbRefreshToken(tokenId: string, userId: string) {
    console.log(tokenId, userId);
    const createdToken = new this.tokenModel({ tokenId, userId });
    return createdToken.save();
  }

  async replaceDbRefreshToken(tokenId: string, userId: string) {
    await this.tokenModel.findOneAndRemove({ userId });
    return await this.tokenModel.create({ tokenId, userId });
  }
}
