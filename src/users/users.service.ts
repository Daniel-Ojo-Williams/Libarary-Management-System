import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from './schema/user.schema';
import { Model } from 'mongoose';
import { AddMemberDtoInput, CreateAdminDtoInput } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDtoInput } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as ccrypto from 'node:crypto';
import { MailerService } from '../mail/mail.service';
import { ChangePasswordDtoInput } from './dto/user-update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private jwtService: JwtService,
    private mailer: MailerService,
  ) {}

  async adminSignup(createAdminInput: CreateAdminDtoInput): Promise<User> {
    const userExists = await this.usersModel.findOne({
      email: createAdminInput.email,
    });
    if (userExists)
      throw new ConflictException({
        message: 'Account with email already exists, please login',
      });
    const password = await bcrypt.hash(createAdminInput.password, 12);
    return this.usersModel.create({
      ...createAdminInput,
      password,
      role: Roles.ADMIN,
    });
  }

  async loginUser(loginUserInput: LoginUserDtoInput) {
    const user = await this.usersModel.findOne({ email: loginUserInput.email });
    if (!user)
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    const passwordMatch = await bcrypt.compare(
      loginUserInput.password,
      user.password,
    );
    if (!passwordMatch)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const token = await this.jwtService.signAsync({
      email: user.email,
      sub: user.id,
    });
    return { token, user };
  }

  async addMember(addMemberInput: AddMemberDtoInput): Promise<User> {
    const userExists = await this.usersModel.findOne({
      email: addMemberInput.email,
    });
    if (userExists)
      throw new ConflictException({
        message: 'Member with email already exists, please login',
      });

    const password = ccrypto.randomBytes(4).toString('hex');
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.usersModel.create({
      ...addMemberInput,
      password: passwordHash,
      role: Roles.MEMBER,
    });
    // TODO: Send User Email of their password...
    await this.mailer.sendMemberEmail(user.email, user.name, password);
    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.usersModel.findOne({ id: userId });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    return user;
  }

  async changePassword(
    userId: string,
    changePassword: ChangePasswordDtoInput,
  ): Promise<void> {
    const user = await this.usersModel.findOne({ id: userId });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    const oldPasswordMatch = await bcrypt.compare(
      changePassword.oldPassword,
      user.password,
    );
    if (!oldPasswordMatch)
      throw new UnauthorizedException({ message: 'Password incorrect' });
    const passwordHash = await bcrypt.hash(changePassword.newPassword, 12);
    user.password = passwordHash;
    await user.save();
  }

  async getAllMembers(): Promise<User[]> {
    const users = await this.usersModel.find();
    return users;
  }
}
