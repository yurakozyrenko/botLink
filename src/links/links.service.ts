import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateLinkDto } from './dto/createLink.dto';
import { Link } from './entity/links.entity';
import { LinksRepository } from './links.repository';
import { User } from '../users/entity/users.entity';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  constructor(private readonly linksRepository: LinksRepository) {}

  async createUserLink(userUrl: string, userId: number): Promise<string> {
    this.logger.log(`Trying to save link`);

    const createLinkDto: CreateLinkDto = { userUrl, userId };

    const link = await this.linksRepository.findOneByUrlAndUserId(userUrl, userId);

    if (link) {
      this.logger.error(`link with userUrl: ${userUrl} already exist`);
      throw new HttpException(`link with userUrl: ${userUrl} already exist`, HttpStatus.BAD_REQUEST);
    }

    const { raw } = await this.linksRepository.createUserLink(createLinkDto);

    this.logger.debug(`link successfully created with id: ${raw[0].id}`);

    return raw[0].id;
  }

  async deleteLinkById(id: Link['id'], userId: number) {
    this.logger.log(`Trying to delete link ${id}`);

    const LinkByUserIdAndId = await this.linksRepository.getLinkByUserIdAndId(id, userId);

    if (!LinkByUserIdAndId) {
      this.logger.error(`link with linkId not exist`);
      throw new HttpException(`link with userId not exist`, HttpStatus.BAD_REQUEST);
    }

    const { affected } = await this.linksRepository.deleteLinkById(id);

    this.logger.debug(`${affected} Link successfully deleted by id: ${id}`);
  }

  async getLinksByUserId(id: User['id'], page: number, limit: number): Promise<[Link[], number]> {
    this.logger.log(`Trying to get links by UserId: ${id}`);

    const offset = (page - 1) * limit;

    const [links, count] = await this.linksRepository.getLinksByUserId(id, offset, limit);

    this.logger.debug(`${count} links successfully get by UserSessionId: ${id}`);

    return [links, count];
  }

  async getLinkById(id: Link['id']): Promise<Link> {
    this.logger.log(`Trying to get link by id: ${id}`);

    const linkById = await this.linksRepository.getLinkById(id);

    this.logger.debug(`${linkById ? 'link ' : 'No link '}get by Id: ${id}`);

    return linkById;
  }

  async findOneByUserIdAndUserUrl(userUrl: string, userId: number): Promise<Link> {
    this.logger.log(`Trying to get link by userId: ${userId}`);

    const linkByUserIdAndUrl = await this.linksRepository.findOneByUrlAndUserId(userUrl, userId);

    return linkByUserIdAndUrl;
  }
}
