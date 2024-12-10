import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Books } from './schema/books.schema';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';

@Resolver(() => Books)
export class BooksResolver {
  constructor(private readonly bookService: BooksService) {}

  @Mutation(() => Books, { name: 'AddBook' })
  async addABook(@Args('newBook') book: AddBookDto): Promise<Books> {
    return this.bookService.addBook(book);
  }

  @Query(() => [Books], { nullable: 'items', name: 'GetAllBooks' })
  async getAllBooks(): Promise<Books[]> {
    return this.bookService.getListOfAllBooks();
  }

  @Query(() => Books, { name: 'GetBook' })
  async getBook(@Args('id') id: string): Promise<Books> {
    return this.bookService.getABook(id);
  }

  @Mutation(() => Boolean, { name: 'DeleteBook', nullable: true })
  async deleteBook(@Args('id') id: string): Promise<boolean> {
    return this.bookService.deleteABook(id);
  }
}
