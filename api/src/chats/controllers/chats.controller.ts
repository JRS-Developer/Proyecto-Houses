import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { pick } from 'lodash';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatsService } from '../services/chats.service';
import { Chat } from '../entities/chats.entity';

@Controller('chats')
@Auth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async getChats(@GetUser('id') userId: number) {
    const chats = await this.chatsService.getUserChats(userId);

    return chats;
  }

  @Get(':id/messages')
  async getChatMessages(
    @Param('id', ParseIntPipe) chatId: number,
    @GetUser('id') userId: number,
  ) {
    const messages = await this.chatsService.getChatMessages({
      chatId,
      userId,
    });
    return messages;
  }

  @Post()
  async createChat(@GetUser('id') userId: number, @Body() body: CreateChatDto) {
    const chat: Chat = await this.chatsService.createChat({
      creatorId: userId,
      receiverId: body.receiverId,
    });

    return pick(chat, ['id'] as const satisfies readonly (keyof Chat)[]);
  }
}
