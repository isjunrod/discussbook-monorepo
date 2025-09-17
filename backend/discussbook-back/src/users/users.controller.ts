// import {
//     Controller,
//     Get,
//     Post,
//     Body,
//     Patch,
//     Param,
//     Delete,
// } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';

import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    //     // @Post()
    //     // create(@Body() createUserDto: CreateUserDto) {
    //     //     return this.usersService.create(createUserDto);
    //     // }

    //     // @Get()
    //     // findAll() {
    //     //     return this.usersService.findAll();
    //     // }

    /* Este endpoint para traer todos los datos relacionados del usuarios 
    22/02/2025: con este endpoint, inicialmente traeremos el userId actual del cliente, con la token que esta en su navegador, ahi detectaremos si 
    la token es valida. Si esta vencida, se le pedira que se loguee nuevamente. Si la token es valida, se le mostrara los datos del usuario.
    */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.UsersService.findOne(id);

        if (!user) {
            return {
                status: 404,
                message: 'No user found',
            };
        }

        return user;
    }

    //     /*
    //     Este endpoint seria cuando le voy agregar un espacio de discussion al usuario

    //     22/02/2025: de momento no se utilizara, ya que hacemos belongsTo, oses que el espacio de discusion pertenece al usuario, por lo que se creara el espacio de discusion y se le asignara el usuario y a este espacio de discusion se le asignara el libro.
    //     */

    //     // @Patch(':id')
    //     // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     //     return this.usersService.update(id, updateUserDto);
    //     // }

    //     // @Delete(':id')
    //     // remove(@Param('id') id: string) {
    //     //     return this.usersService.remove(+id);
    //     // }
}
