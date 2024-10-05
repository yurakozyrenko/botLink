import { PickType } from '@nestjs/mapped-types';

import { LinkDto } from './link.dto';

export class CreateLinkDto extends PickType(LinkDto, ['userUrl', 'userId']) {}
