import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class UpdateTaskDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    done: boolean;

    @IsString()
    @IsOptional()
    dueDate: string;
}
