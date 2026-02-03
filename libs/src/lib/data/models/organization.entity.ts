import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { User } from './user.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./user.entity').User;
  }, (user: User) => user.organization)
  users!: User[];
}
