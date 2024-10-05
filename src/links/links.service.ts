import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateLinkDto } from './dto/createLink.dto';
import { Link } from './entity/links.entity';
import { LinksRepository } from './links.repository';
import { BotService } from '../bot/bot.service';
import { User } from '../users/entity/users.entity';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);
  private readonly chatId: number;

  constructor(
    private readonly linksRepository: LinksRepository,
    private readonly bot: BotService,
    private readonly configService: ConfigService,
  ) {}

  async createUserLink(createLinkDto: CreateLinkDto): Promise<void> {
    this.logger.log(`Trying to save link`);

    await this.linksRepository.createUserLink(createLinkDto);

    this.logger.debug(`link successfully created`);
  }

  async deleteLinkById(id: Link['id']) {
    this.logger.log(`Trying to delete link by id: ${id}`);

    const LinkById = await this.linksRepository.getLinkById(id);

    if (!LinkById) {
      this.logger.error(`link with linkId: ${id} not exist`);
      throw new HttpException(`keyword with keywordId: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { affected } = await this.linksRepository.deleteLinkById(id);

    this.logger.debug(`${affected} Link successfully deleted by id: ${id}`);
  }

  async getLinksByUserId(id: User['id']): Promise<Link[]> {
    this.logger.log(`Trying to get links by UserId: ${id}`);

    const [links, count] = await this.linksRepository.getLinksByUserId(id);

    this.logger.debug(`${count} links successfully get by UserSessionId: ${id}`);

    return links;
  }

  async getLinkById(id: User['id']): Promise<Link> {
    this.logger.log(`Trying to get link by id: ${id}`);

    const linkById = await this.linksRepository.getLinkById(id);

    return linkById;
  }
}
