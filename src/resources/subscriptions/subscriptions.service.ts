import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscribeToPayPalService } from './subscribe.service.dao';
import { LoggerService } from 'src/global/logger/logger.service';
import { localEvents } from 'src/share/events';
import { PrismaService } from 'src/adapters/config/prisma.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new LoggerService(SubscriptionsService.name);
  PAYPAL_BRONZE_PLAN_ID = process.env.PAYPAL_BRONZE_PLAN_ID;
  PAYPAL_SILVER_PLAN_ID = process.env.PAYPAL_SILVER_PLAN_ID;
  PAYPAL_GOLD_PLAN_ID = process.env.PAYPAL_GOLD_PLAN_ID;

  constructor(
    private eventEmitter: EventEmitter2,
    private payalService: SubscribeToPayPalService,
    private prismaService: PrismaService
  ) { }
  subscribe(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const data = this.payalService.subscribe(createSubscriptionDto.plan_id).subscribe((res) => {
        // log subscription data
        console.log(res.data);
        const data = this.payalService.getSubscriptionDetails(res.data.id).subscribe(async (res) => {
          // log subscription details
          console.log(res.data);

          // TODO:: if data, persists them in database subscription model
          return await this.prismaService.$transaction(async (tx) => {
            //  create a subscription
            const subscription = await tx.subscription.create({
              data: {
                id: res.data.id,
                plan_id: res.data.plan.id,
                status: res.data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE', // find difficulties to load prisma SubscriptionStatus enum here.
                start_date: res.data.start_date,
                end_date: res.data.end_date,
                auto_renewal: res.data.auto_renewal,
                description: res.data.description,
                created_at: res.data.status_update_time,
                company_id: createSubscriptionDto.company_id,
                // TODO: update this billing cycle with correct dynamic value: consider using prisma value and paypal incoming value. also above
                payment_mode: res.data.billing_info.payment_method === 'paypal' ? 'PAYPAL' : 'PAYPAL',
              }
            },
            )

            // update the company
            await tx.company.update({
              where: {
                id: createSubscriptionDto.company_id
              },
              data: {
                paypal_id: res.data.subscriber.payer_id,
                company_paypal_email: res.data.subscription_email,
              }
            })

            return subscription;
          })

          // TODO: handle the sending message logig for the below event...
          this.eventEmitter.emit(localEvents.paymentSuccess, res.data);
        }).unsubscribe();
      }).unsubscribe();

      return {
        data,
        status: 201,
        message: `Subscription created successfully`
      }
    } catch (error) {
      this.logger.error(`Error while creating subscription ${error}`, SubscriptionsService.name);
      throw new NotImplementedException();
    }
  }


  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  async upgradeSubscriptionPlan(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.payalService.changPlan(id, <string>updateSubscriptionDto.plan_id).subscribe((res) => {
      if (res.data.status === '200') {
        console.log("\n\n changed plan", res.data);
      }
      // TODO:: if data, persists them in database subscription model
    });
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  // cancel payment

  cancelPayPalPayment(subscriptionPayload: any) {
    this.logger.log('paypal payment cancelled', SubscriptionsService.name);
    console.log(subscriptionPayload);

    // TODO: write listener fot this event to send message to user for cnfirmation
    this.eventEmitter.emit(localEvents.paymentCanceled, subscriptionPayload);
  }

  // success payment

  successPayPalPayment(subscriptionPayload: any) {
    this.logger.log('paypal payment successfull', SubscriptionsService.name);
    console.log(subscriptionPayload);
    // TODO: write listener fot this event to send message to user for cnfirmation
    // this.eventEmitter.emit(localEvents.paymentSuccess, subscriptionPayload);
  }

  // get the subscription for a company
  async getCompanySubscription(company_id: string) {

    try {
      const data = await this.prismaService.subscription.findFirstOrThrow({
        where: {
          company_id: company_id
        },
        select: {
          id: true,
          plan_id: true,   // TODO: make a migration for prisma.
          status: true,
        }
      })

      return {
        data,
        status: 200,
        message: `Subscription fetched successfully`
      }
    } catch (error) {
      this.logger.error(`failed to fetch subscription for company ${company_id}`, SubscriptionsService.name);

      throw new NotFoundException(`failed to fetch subscription for company ${company_id}`);
    }
  }


  // unsubscribe a company
  async unsubscribeCompany({ subscription_id, company_id }: { subscription_id: string, company_id: string }) {

    try {
      return this.payalService.unsubscribe(subscription_id).subscribe((res) => {
        console.log("\n\n unscubscription operation", res.data);

        // TODO: handle logic to update the subscription status of a company
        if (res.data.status === '204') {
          // according to paypal docs, a status of 204 here is consider successfully unsubscribed
          const data = this.prismaService.subscription.update({
            where: {
              id: subscription_id
            },
            data: {
              status: 'CANCELLED'
            }
          });
          return {
            data,
            status: 204,
            message: `Subscription cancelled successfully`
          }
        }

        else
          return {
            status: 500,
            data: null,
            message: `failed to unsubscribe company ${company_id}`,
          }
        // TODO: send email to company for notification
      })
    } catch (error) {
      this.logger.error(`failed to unsubscribe company ${company_id}`, SubscriptionsService.name,);
      throw new NotImplementedException(`failed to unsubscribe company ${company_id}`);
    }

  }
}
