import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/lms'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      csrfPrevention: true,
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions.code,
        };
      },
    }),
    UsersModule,
    BooksModule,
  ],
  controllers: [],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
