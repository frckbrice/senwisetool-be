import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscribeToPayPalService } from './subscribe.service.dao';
// import { HttpModule } from "@nestjs/axios";
import { FetchModule } from 'nestjs-fetch';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';

@Module({
  imports: [FetchModule.register({
    baseUrl: "https://api-m.sandbox.paypal.com"
  })],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscribeToPayPalService, CurrentPlanIds],
})
export class SubscriptionsModule { }
