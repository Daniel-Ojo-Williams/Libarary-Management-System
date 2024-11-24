import {
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MembershipType } from '../schema/user.schema';

registerEnumType(MembershipType, {
  name: 'MembershipType',
  description: 'Membership can be one of Gold, Silver or Standard',
});

@InputType()
export class CreateAdminDtoInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class AddMemberDtoInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsEnum(MembershipType, {
    message: 'Membershipt type should be one of Gold, Silver or Standard',
  })
  @Field(() => MembershipType, {
    description: 'Membership type can be one of Gold, Silver or Standard',
  })
  membershipType: MembershipType;
}
