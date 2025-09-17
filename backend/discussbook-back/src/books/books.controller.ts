import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Res,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    // @Post()
    // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    // create(@Body() createBookDto: CreateBookDto) {
    //     return this.booksService.create(createBookDto);
    // }

    // toda la logica de aca tendria que ir en la controlador creatediscussion e ir importando los modulos de book por ejemplo para
    // obtener el id del libro...
    /* @UploadedFiles() files: Array<Multer.File> */
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async create(@Body() createBookDto: CreateBookDto) {
        const result = await this.booksService.create(createBookDto);
        return { message: 'Libro creado exitosamente', bookId: result };
    }
    // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))

    // @Get()
    // findAll() {
    //     return this.booksService.findAll();
    // }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const book = await this.booksService.findOne(id);
        if (!book) {
            throw new NotFoundException(`Libro con ID ${id} no encontrado`);
        }
        return book;
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    //   return this.booksService.update(+id, updateBookDto);
    // }

    // en el MVP no se podra borrar espacios de discussion, por lo tanto no se borraran libros
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.booksService.remove(+id);
    // }
}
