import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { IsPublic } from './is-public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: SignInDto,
    ): Promise<{ access_token: string }> {
        return await this.authService.signIn(signInDto).catch((error) => {
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid credentials');
            }
            throw error;
        });
    }
}
