import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// export type BookDocument = HydratedDocument<Book>;

@Schema({
    versionKey: false,
})
// todo estan en requied porque solo se crea un book cuando se crea un espacio de discussion, nada mas
export class Book {

    @Prop({ required: true })
    comments: [];

    @Prop({ required: true })
    url: string;
}

export const BookScheme = SchemaFactory.createForClass(Book);
