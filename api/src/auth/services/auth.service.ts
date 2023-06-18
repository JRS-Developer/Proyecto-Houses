import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from 'src/common/interfaces/request.interface';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return null;
    }

    const { password: userPassword, ...result } = user;

    return result;
  }

  async login(user: RequestWithUser['user']) {
    const payload: JwtPayload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
