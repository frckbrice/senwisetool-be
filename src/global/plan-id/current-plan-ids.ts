import { Injectable } from "@nestjs/common";


// the default scope here is singleton
@Injectable()
export class CurrentPlanIds {
    private PAYPAL_BRONZE_PLAN_ID = process.env.PAYPAL_BRONZE_PLAN_ID;
    private PAYPAL_SILVER_PLAN_ID = process.env.PAYPAL_SILVER_PLAN_ID;
    private PAYPAL_GOLD_PLAN_ID = process.env.PAYPAL_GOLD_PLAN_ID;
    PLAN_ID = [
        this.PAYPAL_BRONZE_PLAN_ID,
        this.PAYPAL_SILVER_PLAN_ID,
        this.PAYPAL_GOLD_PLAN_ID
    ];
}