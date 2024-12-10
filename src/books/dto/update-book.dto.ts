import { PartialType } from '@nestjs/graphql';
import { AddBookDto } from './add-book.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {}
