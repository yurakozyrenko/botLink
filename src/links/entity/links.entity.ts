import { IsUUID, IsUrl } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entity/users.entity';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsUrl()
  userUrl: string;

  @ManyToOne(() => User, (user) => user.links)
  user: User;

  @Column()
  userId: number;
}
