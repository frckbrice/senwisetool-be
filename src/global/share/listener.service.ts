import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { localEvents } from './events';
// import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/adapters/config/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CompanyType } from 'src/resources/companies/entities/company.entity';
import { LoggerService } from 'src/global/logger/logger.service';
import { MailServiceEvent } from './mail/mail.service';
import { Request } from 'express';
import { Role, User, UserStatus } from '@prisma/client';

@Injectable()
export class ListenerService {
  counter: number = 1;
  private logger = new LoggerService(ListenerService.name);
  constructor(
    private readonly mailerService: MailerService,
    private prismaService: PrismaService,
    private sendMailService: MailServiceEvent,
  ) { }

  /**
   * Handle the event when a participant is created.
   * by sending the confirmation registration received
   * @param {Participant} payload - The participant data
   */
  @OnEvent(localEvents.paymentSuccess)
  async handleSuccessPaymentLogic(payload: any) {
    // TODO: send email to Customer company
    this.logger.log('handleSuccessPaymentLogic', JSON.stringify(payload));
  }

  @OnEvent(localEvents.paymentCanceled)
  async handleCancelPaymentLogic(payload: any) {
    // TODO: send email to Customer company
    this.logger.log('handleCancelPaymentLogic', JSON.stringify(payload));
  }

  @OnEvent(localEvents.paymentSuccess)
  async handleUnsubscribePaymentLogic(payload: any) {
    // TODO: send email to Customer company
    this.logger.log('handleUnsubscribePaymentLogic', JSON.stringify(payload));
  }

  @OnEvent(localEvents.paymentCanceled)
  async handleUpgradePaymentLogic(payload: any) {
    // TODO: send email to Customer company
    this.logger.log('handleupgradePaymentLogic', JSON.stringify(payload));
  }

  // company created
  @OnEvent(localEvents.companyCreated)
  async handleCompanyCreated(payload: CompanyType) {
    const res = await this.sendMailService.senMail({
      toEmail: payload.email,
      subject: `${payload.name} COMPANY CREATED IN SENWISETOOL PLATEFORM✔`,
      text: 'Thanks for joining us. We are glad you are member of senwisetool plateform. You can now enjoy all the features of our platform.',
    });
    if (res) {
      // TODO: send email to Customer company
      this.logger.log(
        'Company created \n\n ' + JSON.stringify(payload),
        ListenerService.name,
      );
    } else {
      // TODO: will find a better way the handle this later
      while (this.counter < 4) {
        this.handleCompanyCreated(payload);
        this.counter++;
      }
    }
    this.counter = 1;
  }

  // To update the current user and add him to current user state. 
  @OnEvent(localEvents.userCreated)
  async updateRequestCurrentUserPayload(
    payload: Partial<User>,
    req: Request & {
      user: Partial<User>;
    },
  ) {
    const user = {
      id: payload.id,
      first_name: <string>payload.first_name,
      email: payload.email,
      role: <Role>payload.role,
      status: <UserStatus>payload.status,
      company_id: <string>payload.company_id,
    };

    return (req['user'] = user);
  }
}
