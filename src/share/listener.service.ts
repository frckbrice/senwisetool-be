import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { localEvents } from './events'
// import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/adapters/config/prisma.service'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class ListenerService {
  counter: number = 1
  private logger = new Logger(ListenerService.name)

  constructor(private readonly mailerService: MailerService, private prismaService: PrismaService,) { }



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
}
