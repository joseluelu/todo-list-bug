import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(CreateUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = new User();
            newUser.email = CreateUserDto.email;
            newUser.pass = CreateUserDto.password;
            newUser.fullname = CreateUserDto.fullname;

            return await this.usersRepository.save(newUser);
        } catch (error) {
            this.logger.error('Error creating user', error);
            throw error;
        }
    }

    async findOne(email: string) {
        try {
            const user = await this.usersRepository.findOneBy({
                email,
            });
            return user;
        } catch (error) {
            this.logger.error(
                `Error fetching user with email: ${email}`,
                error,
            );
            throw error;
        }
    }
}
