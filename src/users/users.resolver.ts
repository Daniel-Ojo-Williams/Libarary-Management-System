import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { AddMemberDtoInput, CreateAdminDtoInput } from './dto/create-user.dto';
import { LoginReponse, LoginUserDtoInput } from './dto/login-user.dto';
import { Public } from 'src/guards/auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'CreateAdmin' })
  async createUser(
    @Args('createAdminInput') createAdminInput: CreateAdminDtoInput,
  ) {
    return this.usersService.adminSignup(createAdminInput);
  }

  @Query(() => [User], { name: 'GetAllMembers' })
  async getAllMembers() {
    return this.usersService.getAllMembers();
  }

  @Mutation(() => User, { name: 'AddMember' })
  async addMember(@Args('addMemberInput') addMemberInput: AddMemberDtoInput) {
    return this.usersService.addMember(addMemberInput);
  }

  @Public()
  @Mutation(() => LoginReponse, { name: 'LoginUser' })
  async login(@Args('loginInput') loginInput: LoginUserDtoInput) {
    return this.usersService.loginUser(loginInput);
  }
}
