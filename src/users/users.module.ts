import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MailerModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '5h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
