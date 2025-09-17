import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenService } from '../services/tokenService';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private tokenService: TokenService,
    ) {}

    async login(email: string, pass: string, res: Response): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'El email no existe ',
            });
        }

        if (user?.password !== pass) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'La contraseña es incorrecta',
            });
        }

        const payload = { sub: user?.id, email: user?.email };
        const access_token = await this.tokenService.createToken(payload);

        const userModified = { ...user?.toJSON(), password: undefined };
        delete userModified.password;

        return res
            .set({
                Authorization: `Bearer ${access_token}`,
            })
            .status(HttpStatus.OK)
            .json({ user: userModified });
    }

    async signUp(email: string, password: string, res: Response): Promise<any> {
        // verificar que el email no exista
        const userExist = await this.usersService.findOneByEmail(email);

        if (userExist) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'El email ya existe',
            });
        }

        const user = await this.usersService.create({ email, password });

        const payload = { sub: user?.id, email: user?.email };
        const access_token = await this.jwtService.signAsync(payload);

        const userModified = { ...user?.toJSON(), password: undefined };
        delete userModified.password;

        return res
            .set({
                Authorization: `Bearer ${access_token}`,
            })
            .status(HttpStatus.OK)
            .json({
                user: userModified,
            });
    }
}
