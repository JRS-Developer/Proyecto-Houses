import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
// import * as bcrypt from 'bcrypt';
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

    // const match = await bcrypt.compare(password, user.password);
    const match = password === user.password;
    // console.log(await bcrypt.compare(password, user.password));
    // console.log('match', match);

    if (!match) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...result } = user;

    return result;
  }

  async validateWsUser(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async login(user: RequestWithUser['user']) {
    const payload: JwtPayload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
