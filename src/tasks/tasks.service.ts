import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string): Promise<Task[]> {
        const tasks = await this.tasksRepository
            .find({
                where: { owner: { id: userId } },
            })
            .catch((error) => {
                this.logger.error('Error listing tasks', error);
                throw error;
            });

        return tasks;
    }

    async getTask(id: string, userId: string): Promise<Task> {
        const task = await this.tasksRepository
            .findOne({
                where: { id },
                relations: ['owner'],
            })
            .catch((error) => {
                this.logger.error(`Error fetching task with id ${id}`, error);
                throw error;
            });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.owner.id !== userId) {
            throw new ForbiddenException('You do not own this task');
        }

        return task;
    }

    async editTask(task: UpdateTaskDto, userId: string): Promise<Task> {
        await this.getTask(task.id, userId);

        const result = await this.tasksRepository
            .update(task.id, task)
            .catch((error) => {
                this.logger.error(
                    `Error updating task with id ${task.id}`,
                    error,
                );
                throw error;
            });

        if (result.affected === 0) {
            throw new BadRequestException('Task not found or not modified');
        }

        return await this.getTask(task.id, userId);
    }
}
