import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assigneeId: dto.assigneeId,
      },
      include: { assignee: true },
    });
  }

  findAll(query: FindTasksQueryDto) {
    return this.prisma.task.findMany({
      where: {
        status: query.status,
        assigneeId: query.assigneeId === 'unassigned' ? null : query.assigneeId,
      },
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true },
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: { assignee: true },
    });
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: dto.status },
      include: { assignee: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }
}
