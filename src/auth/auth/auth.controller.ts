import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshAuthGuard } from './refresh.guards';
import { UserService } from '../user/user.service';

// UseInterceptors- wyłacza z response te elementy, kóre są ozanczone jako EXCLUDE w klasie
@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() { email, password }: Pick<CreateUserDto, 'email' | 'password'>,
    @Res() res,
  ): Promise<User> {
    const user = await this.authService.register({ email, password });
    await this.authService.setAuthTokens(res, {
      user_id: user.id,
    });

    return res.json({ email, password });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginUserDto, @Res() res) {
    const user = await this.authService.login({ email, password });
    await this.authService.setAuthTokens(res, {
      user_id: user.id,
    });

    return res.json({ message: 'Logged', email });
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res() res) {
    await this.authService.tokenIsActive(
      req?.cookies?.['refresh_token'],
      req.user.refreshToken,
    );

    await this.authService.setAuthTokens(res, {
      user_id: req.user.id,
    });
    return res.json({
      message: 'Token refreshed',
    });
  }

  @Get('logout')
  @UseGuards(RefreshAuthGuard)
  async logout(@Req() req, @Res() res) {
    await this.authService.clearAuthToken(res, req.user.id);
    return res.json({
      message: 'Logged out',
    });
  }

  @Delete('delete')
  @UseGuards(RefreshAuthGuard)
  async delete(@Req() req, @Res({ passthrough: true }) res) {
    await this.authService.clearAuthToken(res, req.user.id);
    return this.userService.delete(req.user.id);
  }
}
