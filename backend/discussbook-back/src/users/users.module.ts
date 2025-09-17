import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
    Space_DiscussionScheme,
    SpaceDiscussion,
} from '../spaces_discussion/schemas/space_discussion.schema';
import { UsersController } from './users.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: SpaceDiscussion.name, schema: Space_DiscussionScheme },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
