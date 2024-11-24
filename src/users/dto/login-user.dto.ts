import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../schema/user.schema';

@InputType()
export class LoginUserDtoInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@ObjectType()
export class LoginReponse {
  @Field()
  token: string;
  @Field(() => User)
  user: User;
}
