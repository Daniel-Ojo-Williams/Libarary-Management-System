import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import mongoose, { Model } from 'mongoose';
import {
  MembershipType,
  Roles,
  User,
} from '../../src/users/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  AddMemberDtoInput,
  CreateAdminDtoInput,
} from '../../src/users/dto/create-user.dto';
import { MailerService } from '../../src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import {
  LoginReponse,
  LoginUserDtoInput,
} from '../../src/users/dto/login-user.dto';
import * as ccrypto from 'node:crypto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let jwtServiceMock: JwtService;
  let mailerServiceMock: MailerService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };
  const mockMailerService = {
    sendMemberEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtServiceMock = module.get<JwtService>(JwtService);
    mailerServiceMock = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Operations', () => {
    const adminPayload: CreateAdminDtoInput = {
      email: 'testemail@gmail.com',
      name: 'Andrew wanock',
      password: '12345',
    };
    const mockAdminResponse: User = {
      id: new mongoose.Types.ObjectId().toString(),
      role: Roles.ADMIN,
      email: adminPayload.email,
      name: adminPayload.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      membershipType: null,
      password: adminPayload.password,
    };
    it('Should register admin acount and return user object', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockResolvedValueOnce(mockAdminResponse as any);

      const response = await service.adminSignup(adminPayload);
      expect(userModel.create).toHaveBeenCalled();
      expect(response).toEqual(mockAdminResponse);
    });

    it('Should login user', async () => {
      const loginUser: LoginUserDtoInput = {
        email: adminPayload.email,
        password: adminPayload.password,
      };
      const loginResponse: LoginReponse = {
        token: 'token',
        user: mockAdminResponse,
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockAdminResponse);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValueOnce(true);
      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValueOnce('token');

      const response = await service.loginUser(loginUser);

      expect(userModel.findOne).toHaveBeenCalled();
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        email: adminPayload.email,
        sub: mockAdminResponse.id,
      });
      expect(response).toEqual(loginResponse);
    });

    it('Should add member', async () => {
      const member: AddMemberDtoInput = {
        email: 'kramus@sample.com',
        membershipType: MembershipType.STANDARD,
        name: 'Kramus',
      };
      const mockPassword = 'password';
      jest.spyOn(ccrypto, 'randomBytes').mockImplementationOnce(
        () =>
          ({
            toString: jest.fn().mockReturnValue(mockPassword),
          }) as unknown as Buffer,
      );

      const memberResponse: User = {
        ...mockAdminResponse,
        email: member.email,
        role: Roles.MEMBER,
        membershipType: MembershipType.STANDARD,
        name: member.name,
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(undefined);

      jest
        .spyOn(userModel, 'create')
        .mockResolvedValueOnce(memberResponse as any);

      const response = await service.addMember(member);
      expect(response).toEqual(memberResponse);
      expect(mailerServiceMock.sendMemberEmail).toHaveBeenCalledWith(
        member.email,
        member.name,
        mockPassword,
      );
    });
  });
});
