// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { CompanyStatus, Prisma, SubscriptionStatus } from '@prisma/client';
// import * as moment from 'moment-timezone';
// import { PrismaService } from 'src/adapters/config/prisma.service';
// import { SubscriptionEntity } from './entities/subscription.entity';
// import { SubscriptionsService } from './subscriptions.service';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { localEvents } from 'src/share/events';
// import { LoggerService } from 'src/global/logger/logger.service';

// @Injectable()
// export class SubscriptionDeactivationService {

//     private logger = new LoggerService(SubscriptionDeactivationService.name)
//     constructor(
//         private prismaService: PrismaService,
//         private subscriptionService: SubscriptionsService,
//         private eventEmitter: EventEmitter2
//     ) { }

//     // TODO: this is heavy operation. Look for a way to handle it optimally later. may be add cache implementation,
//     @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//     async checkSubscriptions() {
//         const subscriptions = await this.subscriptionService.findAll();
//         // check each susbcription
//         subscriptions.data.forEach(async (subscription) => {
//             await this.checkSubscriptionStatus(subscription);
//         });
//     }

//     private async checkSubscriptionStatus(subscription: Prisma.SubscriptionGetPayload<SubscriptionEntity>) {
//         const userTimezone = subscription.status || 'UTC';
//         const now = moment().tz(userTimezone);
//         // convert the end date to customer time zone a



//         const end_date = moment(subscription.end_date).tz(userTimezone);

//         if (now.isAfter(end_date)) {

//             // deactivate the account here.
//             await this.handleExpiredSubscription(subscription);
//         } else if (this.shouldSendNotification(subscription, now)) {
//             await this.sendNotification(subscription);
//         }
//     }

//     // deactiva the compny account.
//     private async handleExpiredSubscription(subscription: Prisma.SubscriptionGetPayload<SubscriptionEntity>) {

//         // update subscription status to expired
//         const deactivateCompanySubs = await this.prismaService.$transaction(async () => {
//             // deactivate
//             const subscriptionData = await this.prismaService.subscription.update({
//                 where: { id: subscription.id },
//                 data: {
//                     status: SubscriptionStatus.EXPIRED
//                 },
//             });

//             // update the company by nulling it paypal_id.
//             await this.prismaService.company.update({
//                 where: { id: subscription.company_id },
//                 data: {
//                     paypal_id: null,
//                     status: CompanyStatus.INACTIVE
//                 },
//             });

//         })
//         await this.notifyDeactivation(subscription.company_id);
//     }

//     private async notifyDeactivation(company_id: string) {
//         const user = await this.prismaService.company.findUnique({ where: { id: company_id } });
//         if (!user) return;

//         this.logger.log(`Notifying user ${company_id} about subscription deactivation`, SubscriptionDeactivationService.name);
//         // Implement actual notification logic here
//     }

//     private shouldSendNotification(subscription: any, now: moment.Moment): boolean {
//         const lastNotificationDate = moment(subscription.lastNotificationDate);
//         const threeMonthsBeforeEnd = moment(subscription.end_date).subtract(3, 'months');

//         return now.isAfter(lastNotificationDate) && now.isBefore(threeMonthsBeforeEnd);
//     }

//     private async sendNotification(subscription: any) {
//         this.logger.log(`Sending notification to user ${subscription.userId}`, SubscriptionDeactivationService.name);
//         // Implement actual notification logic here
//         this.eventEmitter.emit(localEvents.subscriptionExpired, subscription);

//         await this.prismaService.subscription.update({
//             where: { id: subscription.id },
//             data: { lastNotificationDate: new Date().toISOString() },
//         });
//     }
// }


//             // Add 3 weeks of free usage
//             // const freeEndDate = moment(subscription.end_date).add(21, 'days').toDate();
//             // const data = {
//             //     company_id: subscriptionData.company_id,
//             //     start_date: new Date(),
//             //     end_date: freeEndDate,
//             //     status: SubscriptionStatus.ACTIVE,
//             //     lastNotificationDate: null,
//             //     payment_mode: subscriptionData.payment_mode,
//             //     plan_id: subscriptionData.plan_id,
//             //     timeZone: subscriptionData.timeZone,
//             //     company: subscription
//             // }
//             // // update the subscription.
//             // await this.subscriptionService.createSubscription(data);

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { $Enums, Company, CompanyStatus, Prisma, SubscriptionStatus } from '@prisma/client';
import * as moment from 'moment-timezone'
import { PrismaService } from 'src/adapters/config/prisma.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { localEvents } from 'src/share/events';
import { LoggerService } from 'src/global/logger/logger.service';
import { CronJob } from 'cron';

moment.tz.setDefault('Africa/Douala');
type CompanySubscription = {
    company: {
        id: string;
        timezone: string;
    };
} & {
    id: string;
    plan_id: string;
    company_id: string;
    start_date: Date;
    end_date: Date;
    status: $Enums.SubscriptionStatus;
    updated_at: Date;
}
@Injectable()
export class SubscriptionManagementService {
    private logger = new LoggerService(SubscriptionManagementService.name);

    constructor(
        private prismaService: PrismaService,
        private subscriptionService: SubscriptionsService,
        private eventEmitter: EventEmitter2,
        private schedulerRegistry: SchedulerRegistry
    ) {
    }


    @Cron(CronExpression.EVERY_12_HOURS, {
        name: 'check_subscriptions',
    })
    private async checkSubscriptions() {

        const subscriptions = (await this.subscriptionService.getSubscriptionsExpireInNextTwoMonthsOrThreeWeeksAfterExpiration()).data;
        console.log("subscriptions: start ", subscriptions)
        for (const subscription of subscriptions) {
            await this.checkSubscriptionStatus(subscription);
        }
    }


    // add cron job;
    addCronJob(name: string, seconds: string) {
        const job = new CronJob(`${seconds} * * * * *`, () => {
            this.logger.warn(`time (${seconds}) for job ${name} to run!`);
        });

        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.warn(
            `job ${name} added for each minute at ${seconds} seconds!`,
        );
    }

    private async checkSubscriptionStatus(subscription: CompanySubscription) {

        const user_time_zone = subscription.company?.timezone || 'UTC';
        const now = moment().tz(user_time_zone);

        const end_date = moment(subscription.end_date).tz(user_time_zone);
        const grace_end_date = moment(end_date).add(3, 'weeks');

        if (now.isAfter(grace_end_date)) {

            this.logger.log(`Subscription ${subscription.id} definitly expired`, SubscriptionManagementService.name);
            await this.deactivateAccount(subscription);

        } else if (now.isAfter(end_date) && now.isBefore(grace_end_date)) {

            this.logger.log(`Subscription ${subscription.id} passes in grace period`, SubscriptionManagementService.name);
            await this.startGracePeriod(subscription);

        } else if (this.shouldSendNotification(subscription, now)) {

            this.logger.log(`Subscription ${subscription.id} has should be notified`, SubscriptionManagementService.name);
            await this.sendNotificationForSoonExpiration(subscription);

        }
    }

    private async deactivateAccount(subscription: CompanySubscription) {
        await this.prismaService.$transaction(async () => {
            await this.subscriptionService.updateCompanySubscription(subscription.id, {
                status: SubscriptionStatus.EXPIRED
            })

            await this.prismaService.company.update({
                where: { id: subscription.company_id },
                data: {
                    paypal_id: null,
                    status: CompanyStatus.INACTIVE,
                },
            });
        });
        this.logger.log(`Subscription account No: ${subscription.id} has been deactivated`, SubscriptionManagementService.name);
        await this.notifyDeactivation(subscription.company_id);
    }

    private async startGracePeriod(subscription: CompanySubscription) {
        const grace_end_date = moment(subscription.end_date).add(3, 'weeks').toDate();
        await this.subscriptionService.updateCompanySubscription(subscription.id, {
            status: SubscriptionStatus.GRACE_PERIOD,
            grace_period_end: grace_end_date,
        });


        await this.notifyGracePeriodStart(subscription.company_id);
    }

    private shouldSendNotification(subscription: CompanySubscription, now: moment.Moment): boolean {
        const twoMonthsBeforeEnd = moment(subscription.end_date).subtract(2, 'months');
        return now.isAfter(twoMonthsBeforeEnd) && now.isBefore(moment(subscription.end_date));
    }


    private async sendNotificationForSoonExpiration(subscription: CompanySubscription) {

        this.logger.log(`Sending notification to company ${subscription.company_id}`, SubscriptionManagementService.name);
        this.eventEmitter.emit(localEvents.subscriptionRenewalReminder, subscription);

        await this.subscriptionService.updateCompanySubscription(subscription.id, {
            last_notification_date: moment().toDate(),
        });
    }

    // notify company for account deactivation
    private async notifyDeactivation(companyId: string) {

        const company = await this.prismaService.company.findUnique({ where: { id: companyId } });
        if (!company) return;

        this.logger.log(`Notifying company ${companyId} about account deactivation`, SubscriptionManagementService.name);
        this.eventEmitter.emit(localEvents.accountDeactivated, company);
    }

    // notify the company for grace period
    private async notifyGracePeriodStart(companyId: string) {
        const company = await this.prismaService.company.findUnique({ where: { id: companyId } });
        if (!company) return;

        this.logger.log(`Notifying company ${companyId} about grace period start`, SubscriptionManagementService.name);
        this.eventEmitter.emit(localEvents.gracePeriodStarted, company);
    }
}