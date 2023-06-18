import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { RequestWithUser } from 'src/common/interfaces/request.interface';
import { Auth } from '../decorators/auth.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser) {
    const data = await this.authService.login(req.user);

    return {
      statusCode: HttpStatus.OK,
      access_token: data.access_token,
    };
  }

  @Auth()
  @Get('profile')
  getProfile(@GetUser() user: JwtPayload) {
    return user;
  }
}
