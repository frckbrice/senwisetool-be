
import { HttpException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscribeToPayPalService } from './subscribe.service.dao';
import { LoggerService } from 'src/global/logger/logger.service';
import { localEvents } from 'src/share/events';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';
import { CompanyStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new LoggerService(SubscriptionsService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private payalService: SubscribeToPayPalService,
    private prismaService: PrismaService,
    private currentplanIds: CurrentPlanIds
  ) { }

  // this operation is done in the client by the paypal SDK.
  async subscribeToPlanService(createSubscriptionDto: CreateSubscriptionDto) {
    this.logger.log(`launched subscription to plan id: ${createSubscriptionDto.plan_id}`);

    // validate plan id
    if (!this.currentplanIds.PLAN_ID.some((value) => value.id === createSubscriptionDto.plan_id)) {
      throw new Error(`plan id ${createSubscriptionDto.plan_id} not found`)
    }

    try {
      const result = await this.payalService.subscribeToPlan(createSubscriptionDto.plan_id);

      if (result)
        return {
          data: result,
          status: 201,
          message: `Subscription created successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to create subscription`
        }


    } catch (error) {
      this.logger.error(`Error while creating subscription ${error}`, SubscriptionsService.name);
      throw new NotImplementedException();
    }
  }

  // get subcription details
  async getSubscriptionDetails(subscription_id: string, company_id: string) {

    try {
      const result = await this.payalService.getSubscriptionDetails(subscription_id);
      if (result) {
        this.logger.log(`subscription details fetched \n\n result: ${JSON.stringify(result)}`, SubscriptionsService.name);

        // store subscription details to DB.
        const storeSubs = await this.storeSubscriptionDetails(result, company_id);
        if (storeSubs && storeSubs.data?.id)
          this.logger.log(`subscription details stored to DB successfully`, SubscriptionsService.name);
        else
          throw new HttpException("Failed to store subscription details to database", 500);
        // get the plan name:

        // TODO: write listener fot this event to send message to user for confirmation
        this.eventEmitter.emit(localEvents.paymentSuccess, {
          start_time: result?.start_time,
          subscription_id: result?.id,
          subscriber_name: result?.subscriber.name.given_name + " " + result?.subscriber.name.surname,
        });

        return {
          data: result,
          status: 200,
          message: `Subscription details successfully fetched`
        }
      }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch subscription details`
        }
    } catch (error) {
      this.logger.error(`Error while fetching subscription details \n\n ${error}`, SubscribeToPayPalService.name);
      throw new NotImplementedException(`Error while fetching subscription details `);
    }
  }



  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }


  async upgradeSubscriptionPlan(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {

    // validate plan id
    if (!this.currentplanIds.PLAN_ID.some((value) => value.id === updateSubscriptionDto.plan_id)) {
      throw new Error(`plan id ${updateSubscriptionDto.plan_id} not found`)
    }

    const result = await this.payalService.changPlan(id, <string>updateSubscriptionDto.plan_id);
    if (result)
      return {
        data: result,
        status: 201,
        message: `Subscription plan upgraded successfully.`
      }
    else
      return {
        data: null,
        status: 400,
        message: `Failed to upgrade subscription plan.`
      }
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

  async successPayPalPayment(subscription_id: string, company_id: string) {
    this.logger.log('paypal payment successfull', SubscriptionsService.name);

    //  on successful payment, change the status of subscription to active
    await this.getSubscriptionDetails(subscription_id, company_id);
  }

  // get the subscription for a company
  async getCompanySubscription(company_id: string) {

    try {
      const data = await this.prismaService.subscription.findFirst({
        where: {
          company_id: company_id
        },
        select: {
          id: true,
          price_id: true,   // TODO: make a migration for prisma.
          status: true,
          company: {
            select: {
              paypal_id: true,
              status: true,
            }
          }
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
      const result = await this.payalService.unsubscribeToPlan(subscription_id);

      // TODO: handle logic to update the subscription status of a company
      if (result.data.status === '204') {
        // according to paypal docs, a status of 204 here is consider successfully unsubscribed
        const data = this.prismaService.subscription.update({
          where: {
            id: subscription_id
          },
          data: {
            status: 'CANCELLED'
          }
        });
        // TODO: write listener for this event to send message to user for cnfirmation
        this.eventEmitter.emit(localEvents.unsubscribeToPlan, { subscription_id, company_id });
        return {
          data,
          status: 204,
          message: `Subscription cancelled successfully`
        }
      }

      //  TODO: check if this requires a sending message
      else
        return {
          status: 500,
          data: null,
          message: `failed to unsubscribe company ${company_id}`,
        }
      // TODO: send email to company for notification
    } catch (error) {
      this.logger.error(`failed to unsubscribe company ${company_id}`, SubscriptionsService.name,);
      throw new NotImplementedException(`failed to unsubscribe company ${company_id}`);
    }

  }


  // store subscription details
  async storeSubscriptionDetails(subscriptionDetails: any, company_id: string) {
    // TODO: store subscription details

    try {
      // TODO:: if data, persists them in database subscription model
      const data = await this.prismaService.$transaction(async (tx) => {
        //  create a subscription
        const subscription = await tx.subscription.create({
          data: {
            id: subscriptionDetails.id,
            price_id: subscriptionDetails.plan_id,
            status: subscriptionDetails.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE', // find difficulties to load prisma SubscriptionStatus enum here.
            start_date: subscriptionDetails.start_date,
            end_date: subscriptionDetails.end_date,
            created_at: subscriptionDetails.status_update_time,
            company_id: company_id,

            // TODO: update this billing cycle with correct dynamic value: consider using prisma value and paypal incoming value. also above
            payment_mode: subscriptionDetails.billing_info.payment_method === 'paypal' ? 'PAYPAL' : 'PAYPAL',
          }
        },
        )

        // update the company
        await tx.company.update({
          where: {
            id: company_id
          },
          data: {
            paypal_id: subscriptionDetails.subscriber.payer_id,
            company_paypal_email: subscriptionDetails.subscription_email,
            status: CompanyStatus.ACTIVE // set it to active because he has subscribe to a plan.
          }
        })
        // TODO: handle the sending message logig for the below event...
        this.eventEmitter.emit(localEvents.paymentSuccess, subscription);

        return subscription;
      });

      if (data)
        return {
          status: 201,
          message: `Subscription created successfully`,
          data: data
        };
      else
        return {
          status: 500,
          message: `Failed to create subscription`,
          data: null
        }

    } catch (error) {

      this.logger.error(`failed to unsubscribe company ${company_id} \n\n ${error}`, SubscriptionsService.name,);
      throw new InternalServerErrorException(`failed to unsubscribe company ${company_id}`);
    }


  }

}