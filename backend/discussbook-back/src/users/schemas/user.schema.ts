import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Space_DiscussionScheme, SpaceDiscussion } from '../../spaces_discussion/schemas/space_discussion.schema';
import { IsEmail, IsString, MinLength } from 'class-validator';

// export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
})
export class User {
    @Prop({
        required: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
