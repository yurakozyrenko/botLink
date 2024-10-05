import { IsUrl } from 'class-validator';
import { User } from 'src/users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsUrl()
  userUrl: string;

  @ManyToOne(() => User, (user) => user.links)
  user: User;

  @Column()
  userId: number;
}
