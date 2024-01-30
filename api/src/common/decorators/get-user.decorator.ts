import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import {
  RequestWithUserPayload,
  SocketWithUserPayload,
} from '../interfaces/request.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserPayload>();
    const wsRequest = ctx.switchToWs().getClient<SocketWithUserPayload>();

    if (request?.user) {
      return data ? request.user[data] : request.user;
    } else if (wsRequest?.user) {
      return data ? wsRequest.user[data] : wsRequest.user;
    }

    return null;
  },
);
