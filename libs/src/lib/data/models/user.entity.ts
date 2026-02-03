import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Organization } from './organization.entity';
import { Role } from '../enums/roles.enum';
import type { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.VIEWER })
  role!: Role;

  @ManyToOne(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./organization.entity').Organization;
  }, (org: Organization) => org.users)
  organization?: Organization;

  @OneToMany(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./task.entity').Task;
  }, (task: Task) => task.owner)
  tasks!: Task[];
}
