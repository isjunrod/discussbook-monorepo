import {
    Controller,
    Post,
    Body,
    Res,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from '../custom.decoratos';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    login(@Body() signInDto: CreateAuthDto, @Res() res: Response): Promise<any> {
        return this.authService.login(signInDto.email, signInDto.password, res);
    }

    @Public()
    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signUp(@Body() signInDto: CreateAuthDto, @Res() res: Response) {
        return this.authService.signUp(signInDto.email, signInDto.password, res);
    }

    // @Get('profile')
    // getProfile(@Request() req) {
    //   return req.user;
    // }
}
