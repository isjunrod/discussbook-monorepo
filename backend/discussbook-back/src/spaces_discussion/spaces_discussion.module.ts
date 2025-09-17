import { Module } from '@nestjs/common';
import { SpacesDiscussionService } from './spaces_discussion.service';
import { SpacesDiscussionController } from './spaces_discussion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceDiscussion, Space_DiscussionScheme } from './schemas/space_discussion.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SpaceDiscussion.name, schema: Space_DiscussionScheme },
            { name: User.name, schema: UserSchema },
        ]),
        HttpModule
    ],
    controllers: [SpacesDiscussionController],
    providers: [SpacesDiscussionService],
    exports: [SpacesDiscussionService],
})
export class SpacesDiscussionModule {}