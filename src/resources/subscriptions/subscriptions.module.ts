import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscribeToPayPalService } from './subscribe.service.dao';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [SubscribeToPayPalService, HttpModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscribeToPayPalService],
})
export class SubscriptionsModule { }
