import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Link } from './entity/links.entity';
import { LinksRepository } from './links.repository';
import { LinksService } from './links.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), forwardRef(() => BotModule)],
  providers: [LinksService, LinksRepository],
  exports: [LinksService],
})
export class LinksModule {}
