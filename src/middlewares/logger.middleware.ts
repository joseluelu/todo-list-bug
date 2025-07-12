import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(request: Request, response: Response, next: () => void) {
        const { ip, method, baseUrl: url } = request;
        const userAgent = request.get('user-agent') || '';

        response.on('close', () => {
            const { statusCode } = response;

            this.logger.log(
                `${method} ${url} ${statusCode} - ${userAgent} ${ip}`,
            );
        });
        next();
    }
}
