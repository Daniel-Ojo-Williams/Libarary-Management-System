import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType({ description: 'Register a new book' })
export class AddBookDto {
  @IsString()
  @Field()
  author: string;

  @IsString()
  @Field()
  title: string;

  @IsString()
  @Field()
  isbn: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  copies: number;
}
