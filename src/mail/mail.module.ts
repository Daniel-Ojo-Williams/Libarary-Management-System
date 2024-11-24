import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: MailerService,
      useFactory: (config: ConfigService) =>
        new MailerService({
          port: config.get('SMTP_PORT'),
          host: config.get('SMTP_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
