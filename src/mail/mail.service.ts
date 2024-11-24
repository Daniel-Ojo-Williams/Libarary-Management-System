import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { join } from 'path';
import * as ejs from 'ejs';

@Injectable()
export class MailerService {
  private transporter: ReturnType<typeof nodemailer.createTransport>;
  private basePath = join(__dirname, '/templates');
  constructor(private readonly mailerOptions: SMTPTransport.Options) {
    this.transporter = nodemailer.createTransport(this.mailerOptions);
  }

  private async sendMail({
    toEmail,
    toName,
    body,
    subject,
  }: {
    toEmail: string;
    toName: string;
    body: string;
    subject: string;
  }) {
    await this.transporter.sendMail({
      subject,
      html: body,
      from: 'Support<support@thelibrary.com>',
      to: {
        address: toEmail,
        name: toName,
      },
    });
  }

  async sendMemberEmail(email: string, name: string, password: string) {
    const path = join(this.basePath, 'addMember.ejs');
    const html = await ejs.renderFile(path, { password });
    await this.sendMail({
      toEmail: email,
      toName: name,
      subject: 'Registration successfull',
      body: html,
    });
  }
}
