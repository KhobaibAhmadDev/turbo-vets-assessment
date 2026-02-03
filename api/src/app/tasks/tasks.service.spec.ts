import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User, Organization, Role, CreateTaskDto, UpdateTaskDto } from '@myorg/data';
import { TasksService} from './tasks.service';
import { ApiAuditService } from '../audit.service';
import { ForbiddenException } from '@nestjs/common';

describe('TasksService (RBAC)', () => {
  let service: TasksService;
  let mockTaskRepo: Partial<Repository<Task>>;
  let mockAuditService: Partial<ApiAuditService>;

  const testOrg: Organization = {
    id: 'org-1',
    name: 'Acme Corp',
    users: [],
  };

  const ownerUser: User = {
    id: 'user-1',
    email: 'owner@acme.com',
    password: 'hashed',
    role: Role.OWNER,
    organization: testOrg,
    tasks: [],
  };

  const adminUser: User = {
    id: 'user-2',
    email: 'admin@acme.com',
    password: 'hashed',
    role: Role.ADMIN,
    organization: testOrg,
    tasks: [],
  };

  const viewerUser: User = {
    id: 'user-3',
    email: 'viewer@acme.com',
    password: 'hashed',
    role: Role.VIEWER,
    organization: testOrg,
    tasks: [],
  };

  const taskOwnedByOwner: Task = {
    id: 'task-1',
    title: 'Task 1',
    category: 'Work',
    completed: false,
    owner: ownerUser,
  };

  beforeEach(async () => {
    mockAuditService = {
      log: jest.fn(),
    };

    mockTaskRepo = {
      create: jest.fn((dto) => ({ ...dto })),
      save: jest.fn(async (task) => task),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(async () => ({})),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepo,
        },
        {
          provide: ApiAuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should allow user to create task', async () => {
      const dto: CreateTaskDto = { title: 'New Task', category: 'Work' };
      mockTaskRepo.save = jest.fn(async (task) => ({ ...task, id: 'task-new' }));

      const result = await service.create(ownerUser, dto);

      expect(result).toHaveProperty('id');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'create',
          actor: 'owner@acme.com',
          resource: 'task',
        })
      );
    });
  });

  describe('findAll', () => {
    it('OWNER should see all tasks in organization', async () => {
      mockTaskRepo.find = jest.fn(async () => [taskOwnedByOwner]);

      const result = await service.findAll(ownerUser);

      expect(mockTaskRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { owner: { organization: { id: 'org-1' } } },
        })
      );
    });

    it('ADMIN should see all tasks in organization', async () => {
      mockTaskRepo.find = jest.fn(async () => [taskOwnedByOwner]);

      const result = await service.findAll(adminUser);

      expect(mockTaskRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { owner: { organization: { id: 'org-1' } } },
        })
      );
    });

    it('VIEWER should see only own tasks', async () => {
      mockTaskRepo.find = jest.fn(async () => []);

      await service.findAll(viewerUser);

      expect(mockTaskRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { owner: { id: 'user-3' } },
        })
      );
    });
  });

  describe('update', () => {
    it('task owner should be able to update', async () => {
      const dto: UpdateTaskDto = { title: 'Updated' };
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);
      mockTaskRepo.save = jest.fn(async (task) => task);

      const result = await service.update(ownerUser, 'task-1', dto);

      expect(result.title).toBe('Updated');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'update' })
      );
    });

    it('ADMIN in same org should update any task', async () => {
      const dto: UpdateTaskDto = { title: 'Admin Updated' };
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);
      mockTaskRepo.save = jest.fn(async (task) => task);

      const result = await service.update(adminUser, 'task-1', dto);

      expect(result.title).toBe('Admin Updated');
    });

    it('VIEWER should not update any task', async () => {
      const dto: UpdateTaskDto = { title: 'Viewer Update' };
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);

      await expect(service.update(viewerUser, 'task-1', dto)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should reject if task not found', async () => {
      mockTaskRepo.findOne = jest.fn(async () => null);

      await expect(service.update(ownerUser, 'nonexistent', {})).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('remove', () => {
    it('task owner should be able to delete', async () => {
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);

      const result = await service.remove(ownerUser, 'task-1');

      expect(result.removed).toBe(true);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'delete' })
      );
    });

    it('ADMIN in same org should delete', async () => {
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);

      const result = await service.remove(adminUser, 'task-1');

      expect(result.removed).toBe(true);
    });

    it('VIEWER should not delete', async () => {
      mockTaskRepo.findOne = jest.fn(async () => taskOwnedByOwner);

      await expect(service.remove(viewerUser, 'task-1')).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
