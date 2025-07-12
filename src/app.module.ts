import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import path from 'node:path';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: path.resolve(__dirname, '../../db/db.sqlite'),
            autoLoadEntities: true,
        }),
        TasksModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
