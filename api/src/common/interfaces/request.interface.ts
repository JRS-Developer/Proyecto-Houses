import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { User } from 'src/users/entities/users.entity';

export interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}
export interface RequestWithUserPayload extends Request {
  user: JwtPayload;
}
export interface SocketWithUserPayload extends Socket {
  user: JwtPayload;
}
