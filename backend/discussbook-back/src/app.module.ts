import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';
import { SpacesDiscussionModule } from './spaces_discussion/spaces_discussion.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        BooksModule,
        SpacesDiscussionModule,
        AuthModule,
        MongooseModule.forRoot(
            'mongodb+srv://junrod:junior.masna123@apisunat-testing.bod4h.mongodb.net/discuss-book?retryWrites=true&w=majority&appName=discusss-book',
        ),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
