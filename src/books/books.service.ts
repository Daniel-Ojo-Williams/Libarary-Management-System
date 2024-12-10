import { InjectModel } from '@nestjs/mongoose';
import { Books } from './schema/books.schema';
import { Model } from 'mongoose';
import { AddBookDto } from './dto/add-book.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';

export class BooksService {
  constructor(
    @InjectModel(Books.name) private readonly bookModel: Model<Books>,
  ) {}

  async addBook(addBook: AddBookDto): Promise<Books> {
    const bookExists = await this.bookModel.findOne({
      title: addBook.title,
      author: addBook.author,
    });
    if (bookExists)
      throw new ConflictException({ message: 'Book already in library' });
    const book = await this.bookModel.create(addBook);
    return book.save();
  }

  async getListOfAllBooks(): Promise<Books[]> {
    const books = await this.bookModel.find();
    return books;
  }

  async getABook(id: string): Promise<Books> {
    const book = await this.bookModel.findOne({ _id: id });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async updateABook(id: string, updateBookDto: UpdateBookDto): Promise<Books> {
    const book = await this.bookModel.findOneAndUpdate(
      { _id: id },
      updateBookDto,
      { new: true },
    );
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async deleteABook(id: string): Promise<boolean> {
    const book = await this.bookModel.findOneAndDelete({ _id: id });
    if (!book) throw new NotFoundException('Book not found');
    return !!book;
  }
}
