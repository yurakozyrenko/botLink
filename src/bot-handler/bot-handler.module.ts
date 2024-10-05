import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotHandlersService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';
import { UsersModule } from '../users/users.module';
import { LinksModule } from 'src/links/links.module';

@Module({
  imports: [UsersModule, LinksModule, BotModule, HttpModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
