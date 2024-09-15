import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { RequirementPricePlanModule } from '../requirement_price-plan/requirement_price-plan.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ReadCompanyFiles } from './read-company-files';

@Module({
  imports: [RequirementPricePlanModule, SubscriptionsModule],
  controllers: [RequirementController],
  providers: [RequirementService, ReadCompanyFiles],
})
export class RequirementModule {}
