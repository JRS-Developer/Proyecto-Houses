import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatsController } from './controllers/chats.controller';
import { Chat, ChatMessage } from './entities/chats.entity';
import { ChatsService } from './services/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage]), UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [TypeOrmModule, ChatsService],
})
export class ChatsModule {}
