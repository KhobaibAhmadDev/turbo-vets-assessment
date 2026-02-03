import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  category!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./user.entity').User;
  }, (user: User) => user.tasks, { nullable: true })
  owner?: User;
}
