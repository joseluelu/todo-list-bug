import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
    let service: TasksService;
    let tasksRepository: Repository<Task>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        tasksRepository = module.get<Repository<Task>>(
            getRepositoryToken(Task),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('listTasks', () => {
        it('should return an array of tasks for the given user', async () => {
            const tasks = [
                { id: '1', title: 'Task 1', owner: { id: '1' } },
                { id: '2', title: 'Task 2', owner: { id: '1' } },
            ] as Task[];

            jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks);

            const result = await service.listTasks('1');
            expect(result).toEqual(tasks);
        });

        it('should return an empty array if no tasks are found for the given user', async () => {
            const tasks = [] as Task[];

            jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks);

            const result = await service.listTasks('1');
            expect(result).toEqual(tasks);
        });

        it('should throw an error if there is an issue fetching tasks', async () => {
            jest.spyOn(tasksRepository, 'find').mockRejectedValue(new Error());

            await expect(service.listTasks('1')).rejects.toThrow(Error);
        });
    });

    describe('getTask', () => {
        it('should return a task if it exists and belongs to the user', async () => {
            const task = {
                id: '1',
                title: 'Task 1',
                owner: { id: '1' },
            } as Task;

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task);

            const result = await service.getTask('1', '1');
            expect(result).toEqual({
                id: '1',
                title: 'Task 1',
                owner: { id: '1' },
            });
        });

        it('should throw NotFoundException if the task does not exist', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null);

            await expect(service.getTask('1', '1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw ForbiddenException if the task does not belong to the user', async () => {
            const task = {
                id: '1',
                title: 'Task 1',
                owner: { id: '2' },
            } as Task;

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task);

            await expect(service.getTask('1', '1')).rejects.toThrow(
                ForbiddenException,
            );
        });

        it('should throw an error if there is an issue fetching the task', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockRejectedValue(
                new Error(),
            );

            await expect(service.getTask('1', '1')).rejects.toThrow(Error);
        });
    });

    describe('editTask', () => {
        it('should update the task and return the updated task', async () => {
            const updateTaskDto = {
                id: '1',
                title: 'Updated Task',
            } as UpdateTaskDto;
            const task = {
                id: '1',
                title: 'Task 1',
                owner: { id: '1' },
            } as Task;

            jest.spyOn(service, 'getTask').mockResolvedValue(task);
            jest.spyOn(tasksRepository, 'update').mockResolvedValue({
                affected: 1,
            } as UpdateResult);

            const result = await service.editTask(updateTaskDto, '1');
            expect(result).toEqual(task);
        });

        it('should throw NotFoundException if the task does not exist', async () => {
            const updateTaskDto = { id: '1', title: 'Updated Task' } as any;

            jest.spyOn(service, 'getTask').mockRejectedValue(
                new NotFoundException('Task not found'),
            );

            await expect(service.editTask(updateTaskDto, '1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw BadRequestException if the task is not modified', async () => {
            const updateTaskDto = { id: '1', title: 'Updated Task' } as any;

            jest.spyOn(service, 'getTask').mockResolvedValue({
                id: '1',
                title: 'Task 1',
                owner: { id: '1' },
            } as Task);

            jest.spyOn(tasksRepository, 'update').mockResolvedValue({
                affected: 0,
            } as UpdateResult);

            await expect(service.editTask(updateTaskDto, '1')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if there is an issue updating the task', async () => {
            const updateTaskDto = { id: '1', title: 'Updated Task' } as any;

            jest.spyOn(service, 'getTask').mockResolvedValue({
                id: '1',
                title: 'Task 1',
                owner: { id: '1' },
            } as Task);

            jest.spyOn(tasksRepository, 'update').mockRejectedValue(
                new Error(),
            );

            await expect(service.editTask(updateTaskDto, '1')).rejects.toThrow(
                Error,
            );
        });
    });
});
