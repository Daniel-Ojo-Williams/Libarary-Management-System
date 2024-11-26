import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum MembershipType {
  GOLD = 'gold',
  STANDARD = 'standard',
  SILVER = 'silver',
}

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  @Field({ nullable: true })
  membershipType: MembershipType;

  @Field({ nullable: true })
  @Prop({ required: true })
  role: Roles;

  @Field(() => ID)
  id: string;

  @Field(() => Int, { nullable: true })
  __v: number;

  @Prop()
  @Field(() => Date, { nullable: true, description: 'Date user was added' })
  createdAt: Date;

  @Prop()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
