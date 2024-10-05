import { forwardRef, Module } from '@nestjs/common';

import { LinksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entity/links.entity';
import { BotModule } from 'src/bot/bot.module';
import { LinksRepository } from './links.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), forwardRef(() => BotModule)],
  providers: [LinksService, LinksRepository],
  exports: [LinksService],
})
export class LinksModule {}
