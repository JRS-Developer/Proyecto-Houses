import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SocketWithUserPayload } from 'src/common/interfaces/request.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToWs();
    const client = ctx.getClient<SocketWithUserPayload>();
    const token = client.handshake.auth.token?.split(' ')[1];

    try {
      const user = await this.authService.validateWsUser(token);
      client.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
