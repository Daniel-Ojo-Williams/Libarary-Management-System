import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Books, BookSchema } from './schema/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Books.name, schema: BookSchema }]),
  ],
  providers: [BooksService, BooksResolver],
})
export class BooksModule {}
