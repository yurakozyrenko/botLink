import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotHandlersService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';
import { LinksModule } from '../links/links.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, LinksModule, BotModule, HttpModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
