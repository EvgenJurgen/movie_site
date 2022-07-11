import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser, Public } from '../common/decorators';
import { RefreshTokenGuard } from '../common/guards';
import { TokenDocument } from '../token/schemas/token.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { PairOfTokens } from './entities/pair-of-tokens.entity';
import { PairOfTokensInterface } from './interfaces/pair-of-tokens.interface';
import { Token } from '../token/schemas/token.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signUp')
  @ApiCreatedResponse({
    description: 'The new user is placed in the mongo database',
    type: User,
  })
  @ApiConflictResponse({
    description: 'User with this email or password already exists',
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('/signIn')
  @ApiCreatedResponse({
    description: 'A pair of tokens has been generated',
    type: PairOfTokens,
  })
  @ApiNotFoundResponse({
    description: 'User with this email or pasword not found',
  })
  async singIn(
    @Body() createUserDto: CreateUserDto,
  ): Promise<PairOfTokensInterface> {
    return this.authService.signIn(createUserDto.email, createUserDto.password);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-tokens')
  @ApiBearerAuth('refresh-token')
  @ApiCreatedResponse({
    description: 'A pair of tokens has been updated',
    type: PairOfTokens,
  })
  @ApiForbiddenResponse({
    description: 'Invalid token',
  })
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<PairOfTokensInterface> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Delete('/logout')
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({
    description: 'Document with this refresh token should be deleted',
    type: Token,
  })
  async logout(@GetCurrentUser('id') tokenId: string): Promise<TokenDocument> {
    return this.authService.logout(tokenId);
  }
}
