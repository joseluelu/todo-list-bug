import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ResponseTaskDto {
    id: string;

    title: string;

    description: string;

    done: boolean;

    dueDate: string;

    @Exclude()
    owner: User;
}
