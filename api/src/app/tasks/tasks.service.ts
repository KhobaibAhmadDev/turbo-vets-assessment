import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto, Task, UpdateTaskDto, User } from '@myorg/data';


@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async create(user: User, dto: CreateTaskDto) {
    const task = this.taskRepo.create({ ...dto, owner: user });
    return this.taskRepo.save(task);
  }

  async findAll(user: User) {
    if (user.role === 'OWNER') return this.taskRepo.find();
    return this.taskRepo.find({ where: { owner: { id: user.id } } });
  }

  async update(user: User, taskId: string, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['owner'] });
    if (!task) throw new ForbiddenException();
    if (user.role === 'VIEWER') throw new ForbiddenException();
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(user: User, taskId: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['owner'] });
    if (!task) throw new ForbiddenException();
    if (user.role === 'VIEWER') throw new ForbiddenException();
    return this.taskRepo.remove(task);
  }
}
