import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { RequestWithUserPayload } from '../interfaces/request.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request: RequestWithUserPayload = ctx.switchToHttp().getRequest();

    if (request?.user) {
      return data ? request.user[data] : request.user;
    }

    return null;
  },
);
