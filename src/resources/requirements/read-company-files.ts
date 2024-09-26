import { Injectable } from '@nestjs/common';

import {
  BronzePlanRequirements,
  GoldPlanRequirements,
  SilverPlanRequirements
} from './classes';

@Injectable()
export class PlanFactory {

  getPlanRequirements(plan_name: string, directory: string) {

    switch (plan_name) {
      case 'gold':
        return new GoldPlanRequirements(
          plan_name, directory
        );
      case 'silver':
        return new SilverPlanRequirements(
          plan_name, directory
        );
      case 'bronze':
        return new BronzePlanRequirements(
          plan_name, directory
        );
      default:
        console.error(`unrecognized plan: `)
    }
  }
}