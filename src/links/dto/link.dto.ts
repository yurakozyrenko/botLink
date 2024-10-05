import { IsUrl } from 'class-validator';

import { Link } from '../entity/links.entity';

export class LinkDto {
  @IsUrl()
  userUrl: Link['userUrl'];

  userId: number;
}
