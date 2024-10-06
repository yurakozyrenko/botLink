import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { CreateLinkDto } from './dto/createLink.dto';
import { Link } from './entity/links.entity';

@Injectable()
export class LinksRepository {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async createUserLink(createLinkDto: CreateLinkDto): Promise<InsertResult> {
    return await this.linksRepository.createQueryBuilder('links').insert().into(Link).values(createLinkDto).execute();
  }

  async deleteLinkById(id: string): Promise<DeleteResult> {
    return await this.linksRepository.createQueryBuilder('links').delete().where('id = :id', { id }).execute();
  }

  async getLinkById(id: string): Promise<Link> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .leftJoinAndSelect('links.user', 'user')
      .where('links.id = :id', { id })
      .getOne();
  }

  async getLinkByUserIdAndId(id: string, userId: number): Promise<Link> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .where('links.id = :id', { id })
      .andWhere('links.userId = :userId', { userId })
      .getOne();
  }

  async getLinksByUserId(id: number, offset: number, limit: number): Promise<[Link[], number]> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .limit(limit)
      .offset(offset)
      .orderBy('links.created_at', 'DESC')
      .where('links.user_id = :id', { id })
      .getManyAndCount();
  }

  async findOneByUrlAndUserId(userUrl: string, userId: number): Promise<Link> {
    return await this.linksRepository
      .createQueryBuilder('links')
      .where('links.userUrl = :userUrl', { userUrl })
      .andWhere('links.userId = :userId', { userId })
      .getOne();
  }
}
