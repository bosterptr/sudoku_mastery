import {
  BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '.';

@Entity()
export default class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true, length: 256 })
  ua: string | null;

  @ManyToMany(() => User, (user) => user.id)
  user!: User[];
}
