import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { TokenService } from '../services/tokenService';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '604800s' } /* 604800s */,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, TokenService],
    exports: [AuthService, TokenService],
})
export class AuthModule {}
