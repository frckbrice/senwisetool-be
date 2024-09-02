import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';

@Module({
  imports: [],
  controllers: [PricesController],
  providers: [PricesService, CurrentPlanIds],
})
export class PricesModule { }
