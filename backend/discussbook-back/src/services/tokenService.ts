import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) {}

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    async createToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
