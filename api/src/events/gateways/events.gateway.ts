import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { CreateMessageDto } from 'src/chats/dto/create-message.dto';
import { ChatsService } from 'src/chats/services/chats.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    exceptionFactory(this: ValidationPipe, validationErrors) {
      if (this.isDetailedOutputDisabled) {
        return new WsException('Validation failed');
      }

      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException(errors);
    },
  }),
)
@UseGuards(WsJwtGuard)
export class EventsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('subscribe')
  subscribe(@GetUser('id') userId: number, @ConnectedSocket() client: Socket) {
    client.join(userId.toString());
  }

  @SubscribeMessage('message')
  async message(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
    @GetUser('id') userId: number,
  ) {
    client.emit('message', {
      id: uuidv4(),
      chatId: payload.chatId,
      body: payload.message,
      senderId: userId,
      createdAt: new Date(),
    });

    const saved = await this.chatsService.createChatMessage({
      chatId: payload.chatId,
      message: payload.message,
      senderId: userId,
    });

    client.to(saved.receiverId.toString()).emit('new-message', saved);
  }
}
