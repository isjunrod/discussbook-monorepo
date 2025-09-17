import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../custom.decoratos';
import { TokenService } from '../services/tokenService';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            await this.tokenService.verifyToken(token);
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
