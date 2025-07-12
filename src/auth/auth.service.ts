import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn({
        email,
        password,
    }: SignInDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(email);

        if (!user) {
            this.logger.log(`User with email ${email} not found`);
            throw new UnauthorizedException();
        }

        if (user?.pass !== password) {
            this.logger.log(`Invalid password for user with email ${email}`);
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
            }),
        };
    }
}
