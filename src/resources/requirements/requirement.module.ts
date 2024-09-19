import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { RequirementPricePlanModule } from '../requirement_price-plan/requirement_price-plan.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ReadCompanyFilesFactory } from './read-company-files';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';

@Module({
  imports: [RequirementPricePlanModule, SubscriptionsModule],
  controllers: [RequirementController],
  providers: [RequirementService, ReadCompanyFilesFactory, CurrentPlanIds],
})
export class RequirementModule { }
