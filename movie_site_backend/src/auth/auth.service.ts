import { v4 as uuidv4 } from 'uuid';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { tokens } from './constants/tokensOptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new ForbiddenException(
        'User with this email and password not found',
      );
    }

    const accessToken = await this.generateAccessToken(user._id.toHexString());
    const refreshToken = await this.generateRefreshToken();

    await this.tokenService.saveDbRefreshToken(
      refreshToken.id,
      user._id.toHexString(),
    );

    return { accessToken, refreshToken: refreshToken.token };
  }

  async logout(tokenId: string) {
    return await this.tokenService.removeDbRefreshTokenByTokenId(tokenId);
  }

  async refreshTokens(refreshToken: string) {
    const { id, type } = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET,
    });

    if (type !== tokens.refresh.type) {
      throw new ForbiddenException('Invalid token');
    }

    const token = await this.tokenService.findById(id);

    if (!token) {
      throw new ForbiddenException('Invalid token');
    }

    const accessToken = await this.generateAccessToken(token.userId);
    const newRefreshToken = await this.generateRefreshToken();

    await this.tokenService.replaceDbRefreshToken(
      newRefreshToken.id,
      token.userId,
    );

    return { accessToken, refreshToken: newRefreshToken.token };
  }

  private async generateAccessToken(userId: string) {
    const payload = {
      userId,
      type: tokens.access.type,
    };

    console.log(payload);

    const options = {
      secret: process.env.ACCESS_JWT_SECRET,
      expiresIn: tokens.access.expriresIn,
    };

    return this.jwtService.sign(payload, options);
  }

  private async generateRefreshToken() {
    const payload = {
      id: uuidv4(),
      type: tokens.refresh.type,
    };

    const options = {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: tokens.refresh.expriresIn,
    };

    return {
      id: payload.id,
      token: this.jwtService.sign(payload, options),
    };
  }
}
