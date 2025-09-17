import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: Model<Book>,
    ) {}

    async create(createBookDto: CreateBookDto) {
        const createdBook = new this.bookModel({
            comments: [],
            url: createBookDto.url,
        });

        await createdBook.save();

        return createdBook;
    }

    // No usare esto ya que usare populate y los Id's ya aparecen en el objeto
    // findAll() {
    //     return `This action returns all books`;
    // }

    findOne(id: string) {
        return this.bookModel.findById(id).populate('comments');
    }

    // update(id: number, updateBookDto: UpdateBookDto) {
    //     return `This action updates a #${id} book`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} book`;
    // }
}
