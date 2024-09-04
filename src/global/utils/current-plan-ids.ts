import { Injectable } from "@nestjs/common";


// the default scope here is singleton
@Injectable()
export class CurrentPlanIds {
    private PAYPAL_BRONZE_PLAN_ID = process.env.PAYPAL_BRONZE_PLAN_ID;
    private PAYPAL_SILVER_PLAN_ID = process.env.PAYPAL_SILVER_PLAN_ID;
    private PAYPAL_GOLD_PLAN_ID = process.env.PAYPAL_GOLD_PLAN_ID;

    // TODO: update this later to respect good OOP principles.
    // this is just for the sake of demo.
    PLAN_ID = [{
        name: "bronze",
        id: this.PAYPAL_BRONZE_PLAN_ID,
    }, {
        name: "silver",
        id: this.PAYPAL_SILVER_PLAN_ID,
    }, {
        name: "gold",
        id: this.PAYPAL_GOLD_PLAN_ID
    }]
}