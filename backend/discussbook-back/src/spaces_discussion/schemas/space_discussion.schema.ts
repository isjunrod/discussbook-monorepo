import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({
    versionKey: false,
})
export class SpaceDiscussion {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    access: string;

    @Prop({ required: false })
    password: string

    @Prop({ required: true })
    comments: [];

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    bookId: string;

    // Esto para hacer belongsTo y traer los espacios de discusion de un usuario para mostrarlos en la barra lateral izquierda
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: User;
}

export const Space_DiscussionScheme =
    SchemaFactory.createForClass(SpaceDiscussion);
