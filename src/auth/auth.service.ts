import { v4 as uuidv4 } from 'uuid';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { tokens } from './constants/tokensOptions';
import { UserDocument } from '../user/schemas/user.schema';
import { PairOfTokensInterface } from './interfaces/pair-of-tokens.interface';
import { TokenDocument } from '../token/schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<PairOfTokensInterface> {
    const userFromDatabase = await this.userService.findByEmailAndPassword(
      createUserDto.email,
      createUserDto.password,
    );

    if (userFromDatabase) {
      throw new ConflictException(
        'User with this email or password already exists',
      );
    }

    const user = await this.userService.create(createUserDto);

    const accessToken = this.generateAccessToken(user._id.toHexString());
    const refreshToken = this.generateRefreshToken();

    await this.tokenService.saveDbRefreshToken(
      refreshToken.id,
      refreshToken.exp,
      user._id.toHexString(),
    );

    return { accessToken, refreshToken: refreshToken.token };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<PairOfTokensInterface> {
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new NotFoundException(
        'User with this email and password not found',
      );
    }

    const accessToken = this.generateAccessToken(user._id.toHexString());
    const refreshToken = this.generateRefreshToken();

    await this.tokenService.saveDbRefreshToken(
      refreshToken.id,
      refreshToken.exp,
      user._id.toHexString(),
    );

    return { accessToken, refreshToken: refreshToken.token };
  }

  async logout(tokenId: string): Promise<TokenDocument> {
    return await this.tokenService.removeDbRefreshTokenByTokenId(tokenId);
  }

  async refreshTokens(refreshToken: string): Promise<PairOfTokensInterface> {
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

    const accessToken = this.generateAccessToken(token.userId);
    const newRefreshToken = this.generateRefreshToken();

    await this.tokenService.replaceDbRefreshToken(
      newRefreshToken.id,
      newRefreshToken.exp,
      token.userId,
    );

    return { accessToken, refreshToken: newRefreshToken.token };
  }

  private generateAccessToken(userId: string): string {
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

  private generateRefreshToken(): { id: string; exp: number; token: string } {
    const payload = {
      id: uuidv4(),
      type: tokens.refresh.type,
    };

    const options = {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: tokens.refresh.expriresIn,
    };

    const token = this.jwtService.sign(payload, options);

    return {
      id: payload.id,
      exp: this.jwtService.decode(token)['exp'],
      token: token,
    };
  }
}
