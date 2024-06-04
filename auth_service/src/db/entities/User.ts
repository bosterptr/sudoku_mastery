import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device, NetworkAddress } from '.';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { default: false })
  blocked: boolean;

  @Column('varchar', { unique: true, length: 256 })
  email: string;

  @Column('boolean', { default: true })
  firstLogIn: boolean;

  @Column('varchar', { length: 60 })
  hashedPassword: string;

  @Column('varchar', {
    nullable: true,
    length: 256,
  })
  profileBio: string | null;

  @Column('integer', { name: 'tokenVersion', default: 0 })
  tokenVersion: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 32,
  })
  displayName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Device, (device) => device.id, {
    cascade: true,
  })
  @JoinTable()
  devices: Device[];

  @ManyToMany(() => NetworkAddress, (networkAddress) => networkAddress.ip)
  @JoinTable()
  networkAddresses: NetworkAddress[];
}
