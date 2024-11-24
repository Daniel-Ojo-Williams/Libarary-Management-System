import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChangePasswordDtoInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}