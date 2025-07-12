import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { plainToInstance } from 'class-transformer';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks(
        @Req() request: { user: { id: string } },
    ): Promise<ResponseTaskDto[]> {
        return this.tasksService.listTasks(request.user.id);
    }

    @Get('/:id')
    async getTask(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() request: { user: { id: string } },
    ): Promise<ResponseTaskDto> {
        const task = await this.tasksService.getTask(id, request.user.id);
        return plainToInstance(ResponseTaskDto, task);
    }

    @Post('/edit')
    async editTask(
        @Body() task: UpdateTaskDto,
        @Req() request: { user: { id: string } },
    ): Promise<ResponseTaskDto> {
        const updatedTask = await this.tasksService.editTask(
            task,
            request.user.id,
        );
        return plainToInstance(ResponseTaskDto, updatedTask);
    }
}
