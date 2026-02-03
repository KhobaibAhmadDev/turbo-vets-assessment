import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto, Task, UpdateTaskDto, User, Role } from '@myorg/data';
import { ApiAuditService } from '../audit.service';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private audit: ApiAuditService,
  ) {}

  async create(user: User, dto: CreateTaskDto) {
    const task = this.taskRepo.create(dto);
    const saved = await this.taskRepo.save(task);
    this.audit.log({ action: 'create', actor: user.email, resource: 'task', resourceId: saved.id });
    return saved;
  }

  async findAll(user: User) {
    try {
      return await this.taskRepo.find({ relations: ['owner'] });
    } catch (error) {
      console.error('Error finding tasks:', error);
      return await this.taskRepo.find();
    }
  }

  async update(user: User, taskId: string, dto: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: ['owner'] });
    if (!task) throw new ForbiddenException('Task not found');
    
    Object.assign(task, dto);
    const saved = await this.taskRepo.save(task);
    this.audit.log({ action: 'update', actor: user.email, resource: 'task', resourceId: taskId });
    return saved;
  }

  async remove(user: User, taskId: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    
    await this.taskRepo.remove(task);
    this.audit.log({ action: 'delete', actor: user.email, resource: 'task', resourceId: taskId });
    return { message: 'Task deleted successfully' };
  }
}
