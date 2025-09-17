import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    Res,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    NotFoundException,
    HttpStatus,
    Put,
} from '@nestjs/common';
import { SpacesDiscussionService } from './spaces_discussion.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { UpdateSpacesDiscussionDto } from './dto/update-spaces_discussion.dto';
import { stat } from 'fs';

@Controller('spaces-discussion')
export class SpacesDiscussionController {
    constructor(private readonly spacesDiscussionService: SpacesDiscussionService) {}

    /* 
    18/02/2025: para crear un espacio de discusion, primero de debe crear el book, luego el espacio de discusion, por lo que se debe enviar el id del book.
    */
    @Post()
    @UseInterceptors(FileInterceptor('file')) // Este interceptor captura el campo 'file' del FormData
    create(
        @UploadedFile() file: Multer.File, // Recibe el archivo
        @Body('metadata') metadata: string,
    ) {
        return this.spacesDiscussionService.create(file, metadata);
    }

    // con esto obtenemos todos los espacios de discussion del usuario actual para mostrarlos en el front en la barra lateral izquierda
    // tambien cada espacio de discusion obtendra su libro asociado

    /* 
    18/02/2025: de momento esto no se utilizara, es decir, no traeremos los datos por fragmentos, traeremos los datos de golpe, ya que el usuario tiene los espacios de discussion y estos los libros asociados.

    21/02/2025: se utilizara para traer los espacios de discusion del usuario actual para mostrarlos en la barra lateral izquierda
    */
    // @Get(':userId')
    // findAllForUserId(@Param('userId') userId: string) {
    //     return this.spacesDiscussionService.findAllByUser(userId);
    // }

    // Obtener el pdf en binario para enviarselo al cliente y mostrarlo en el visor de PDF
    @Get('pdf/:id')
    async getPdf(@Param('id') bookId: string, @Res() res: any) {
        try {
            // Obtener los datos binarios del PDF
            const pdfData = await this.spacesDiscussionService.getPdfBinaryData(bookId);

            // Configurar los headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');

            // Enviar el PDF como respuesta
            res.send(pdfData);
        } catch (error) {
            console.error('Error al obtener el PDF:', error);
            if (error instanceof NotFoundException) {
                res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener el PDF' });
            }
        }
    }

    // Trae todos los espacios de discusion para mostrarlos en el buscador
    // @AuthGuard.str
    @Get()
    findAll() {
        return this.spacesDiscussionService.findAll();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSpacesDiscussionDto: UpdateSpacesDiscussionDto) {
        const documentUpdated = await this.spacesDiscussionService.update(id, updateSpacesDiscussionDto);

        if (!documentUpdated) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Error updating the discussion space',
            }
        }

        return {
            status: HttpStatus.OK,
            message: 'Discussion space updated successfully',
            data: documentUpdated,
        }
    }
}
