import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Chat, ChatMessage } from '../entities/chats.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,

    private readonly usersService: UsersService,
  ) {}

  async createChat({
    creatorId,
    receiverId,
  }: {
    creatorId: number;
    receiverId: number;
  }) {
    const chatExists = await this.chatsRepository.findOne({
      where: [
        {
          creator: { id: creatorId },
          receiver: { id: receiverId },
        },
        {
          creator: { id: receiverId },
          receiver: { id: creatorId },
        },
      ],
    });

    if (chatExists) {
      return chatExists;
    }

    const [creator, receiver] = await Promise.all([
      this.usersService.findOne({
        where: {
          id: creatorId,
        },
      }),
      this.usersService.findOne({
        where: {
          id: receiverId,
        },
      }),
    ]);

    if (!creator || !receiver) {
      throw new NotFoundException('Creator or receiver not found');
    }

    const chat = this.chatsRepository.create({
      receiver,
      creator,
    });

    return this.chatsRepository.save(chat);
  }

  async getUserChats(userId: number) {
    let chats = await this.chatsRepository.find({
      where: [
        {
          receiver: { id: userId },
        },
        {
          creator: { id: userId },
        },
      ],
      relations: {
        creator: true,
        receiver: true,
      },
      select: {
        id: true,
        creatorId: true,
        receiverId: true,
        receiver: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
        creator: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
    });

    chats = await Promise.all(
      chats.map(async (c) => {
        const lastMessage = await this.chatMessagesRepository.findOne({
          where: {
            chat: {
              id: c.id,
            },
          },
          order: {
            createdAt: 'DESC',
          },
        });

        c.lastMessage = lastMessage;

        return c;
      }),
    );

    return chats.sort((a, b) => {
      if (!a.lastMessage) {
        return -1;
      }
      if (!b.lastMessage) {
        return 1;
      }
      return (
        b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
      );
    });
  }

  async getChatMessages({
    chatId,
    userId,
  }: {
    chatId: number;
    userId: number;
  }) {
    const chat = await this.chatsRepository.findOne({
      where: [
        {
          id: chatId,
          receiver: { id: userId },
        },
        {
          id: chatId,
          creator: { id: userId },
        },
      ],
      relations: {
        messages: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat.messages;
  }

  async createChatMessage({
    chatId,
    message,
    senderId,
  }: {
    chatId: number;
    message: string;
    senderId: number;
  }): Promise<{
    message: { id: number; body: string; createdAt: Date; read: boolean };
    sender: { id: number; firstName: string; lastName: string; image: string };
    receiverId: number;
  }> {
    const chat = await this.chatsRepository.findOne({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new WsException('Chat not found');
    }

    const sender = await this.usersService.findOne({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      throw new WsException('Sender not found');
    }

    const messageEntity = this.chatMessagesRepository.create({
      sender,
      message,
      read: false,
      chat,
    });

    const saved = await this.chatMessagesRepository.save(messageEntity);

    const receiverId =
      chat.creatorId === senderId ? chat.receiverId : chat.creatorId;

    return {
      message: {
        id: saved.id,
        body: saved.message,
        createdAt: saved.createdAt,
        read: saved.read,
      },
      sender: {
        id: sender.id,
        firstName: sender.firstName,
        lastName: sender.lastName,
        image: sender.image,
      },
      receiverId,
    };
  }
}
