import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Books {
  @Field(() => ID)
  id: string;

  @Prop({ required: true, index: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  author: string;

  @Prop({ required: true })
  @Field()
  isbn: string;

  @Prop({ required: true, type: 'number', default: 0 })
  @Field(() => Int, { description: 'Number of available copies' })
  copies: number;

  @Prop()
  @Field(() => Date, { nullable: true, description: 'Date user was added' })
  createdAt: Date;

  @Prop()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Books);
