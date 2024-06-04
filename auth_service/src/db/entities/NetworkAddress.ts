import {
  BaseEntity, Entity, ManyToMany, PrimaryColumn
} from 'typeorm';
import { User } from '.';

@Entity()
export default class NetworkAddress extends BaseEntity {
  @PrimaryColumn('cidr')
  ip: string;

  @ManyToMany(() => User, (user) => user.id)
  user!: User[];
}
