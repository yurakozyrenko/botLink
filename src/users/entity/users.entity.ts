import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from '../../links/entity/links.entity';
import { bigintTransformer } from '../../utils/bigintTransformer';
import { UserState } from '../users.constants';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    transformer: bigintTransformer,
    unique: true,
  })
  chatId: number;

  @Column({ type: 'enum', enum: UserState, default: null })
  userState: UserState;

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
