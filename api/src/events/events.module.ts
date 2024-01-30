import { Module } from '@nestjs/common';
import { EventsGateway } from './gateways/events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [AuthModule, ChatsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
