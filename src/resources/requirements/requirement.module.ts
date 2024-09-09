import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { RequirementPricePlanModule } from '../requirement_price-plan/requirement_price-plan.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [RequirementPricePlanModule, SubscriptionsModule],
  controllers: [RequirementController],
  providers: [RequirementService],
})
export class RequirementModule { }
