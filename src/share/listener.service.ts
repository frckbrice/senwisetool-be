import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { localEvents } from './events'
// import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/adapters/config/prisma.service'
import { MailerService } from '@nestjs-modules/mailer'
import { CompanyType } from 'src/resources/companies/entities/company.entity'
import { LoggerService } from 'src/global/logger/logger.service'
import { MailServiceEvent } from './mail/mail.service'

@Injectable()
export class ListenerService {
  counter: number = 1
  private logger = new LoggerService(ListenerService.name)
  constructor(
    private readonly mailerService: MailerService,
    private prismaService: PrismaService,
    private sendMailService: MailServiceEvent
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
  async handleupgradePaymentLogic(payload: any) {

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
    if (res.endWith("gsmtp")) {
      // TODO: send email to Customer company
      this.logger.log('Company created \n\n ' + JSON.stringify(payload), ListenerService.name);
    }
    else {
      while (this.counter < 4) {
        this.handleCompanyCreated(payload)
        this.counter++;
      }
    }
    this.counter = 1;
  }
}
