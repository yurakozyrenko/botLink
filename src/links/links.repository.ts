import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { Link } from './entity/links.entity';
import { CreateLinkDto } from './dto/createLink.dto';

@Injectable()
export class LinksRepository {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>
  ) {}

  async createUserLink(createLinkDto: CreateLinkDto): Promise<InsertResult> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .insert()
      .into(Link)
      .values(createLinkDto)
      .execute();
  }

  async deleteLinkById(id: number): Promise<DeleteResult> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async getLinkById(id: number): Promise<Link> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .leftJoinAndSelect('links.user', 'user')
      .where('links.id = :id', { id })
      .getOne();
  }

  async getLinksByUserId(id: number): Promise<[Link[], number]> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .where('links.user_id = :id', { id })
      .getManyAndCount();
  }
}
