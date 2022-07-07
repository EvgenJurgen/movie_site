import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser, Public } from '../common/decorators';
import { RefreshTokenGuard } from '../common/guards';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('/signIn')
  async singIn(@Body() createUserDto: CreateUserDto) {
    return this.authService.signIn(createUserDto.email, createUserDto.password);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-tokens')
  async refreshTokens(@GetCurrentUser('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/logout')
  async logout(@GetCurrentUser('id') tokenId: string) {
    return this.authService.logout(tokenId);
  }
}
