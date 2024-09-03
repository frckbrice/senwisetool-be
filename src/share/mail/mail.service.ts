import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });

@Injectable()
export class MailServiceEvent {
  constructor(
    private readonly mailerService: MailerService,
    private prismaService: PrismaService,
  ) { }

  senMail(user_object: Object): void {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => { })
      .catch(() => { });
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number,) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
