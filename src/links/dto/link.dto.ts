import { IsUrl } from 'class-validator';

import { Link } from '../entity/links.entity';

export class LinkDto {
  @IsUrl()
  userUrl: Link['userUrl'];

  // Поле для связи с пользователем
  userId: number; // Здесь передаем только ID пользователя
}
