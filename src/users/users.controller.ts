import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/auth/is-public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @IsPublic()
    @Post('/create')
    async create(@Body() CreateUserDto: CreateUserDto) {
        return this.usersService.create(CreateUserDto);
    }
}
