import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from '../enums/roles.enum';
import { Task } from './task.entity';

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

  @ManyToOne(() => Organization, (org) => org.users)
  organization?: Organization;

  @OneToMany(() => Task, (task) => task.owner)
  tasks?: Task[];
}
