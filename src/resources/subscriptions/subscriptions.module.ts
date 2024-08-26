import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscribeToPayPalService } from './subscribe.service.paypal';

@Module({
  imports: [SubscribeToPayPalService],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscribeToPayPalService],
})
export class SubscriptionsModule { }
