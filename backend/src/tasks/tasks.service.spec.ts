import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: {
    task: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a task with the assignee included', async () => {
      const created = { id: '1', title: 'New task', status: 'todo', assignee: null };
      prisma.task.create.mockResolvedValue(created);

      const result = await service.create({ title: 'New task' });

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { title: 'New task', description: undefined, status: undefined, assigneeId: undefined },
        include: { assignee: true },
      });
      expect(result).toBe(created);
    });
  });

  describe('findAll', () => {
    it('filters by status and assignee', async () => {
      prisma.task.findMany.mockResolvedValue([]);

      await service.findAll({ status: 'done' as any, assigneeId: 'user-1' });

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { status: 'done', assigneeId: 'user-1' },
        include: { assignee: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    it('returns the task when found', async () => {
      const task = { id: '1', title: 'Task' };
      prisma.task.findUnique.mockResolvedValue(task);

      await expect(service.findOne('1')).resolves.toBe(task);
    });
  });

  describe('updateStatus', () => {
    it('throws when the task is missing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('missing', { status: 'done' as any })).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.task.update).not.toHaveBeenCalled();
    });

    it('updates the status when the task exists', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: '1' });
      const updated = { id: '1', status: 'done' };
      prisma.task.update.mockResolvedValue(updated);

      const result = await service.updateStatus('1', { status: 'done' as any });

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'done' },
        include: { assignee: true },
      });
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('throws when the task is missing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
      expect(prisma.task.delete).not.toHaveBeenCalled();
    });

    it('deletes the task when it exists', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: '1' });

      await service.remove('1');

      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
