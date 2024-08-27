import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";


// create a subscription in paypal
@Injectable()
export class SubscribeToPayPalService {
    base = "https://api-m.sandbox.paypal.com";
    CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    ClIENT_PUBLIC_URL = process.env.ClIENT_PUBLIC_URL;

    constructor(private readonly httpService: HttpService) { }

    auth: string = Buffer.from(this.CLIENT_ID + ':' + this.CLIENT_SECRET).toString('base64');
    //  create subscription payload.
    setSubscriptionPayload(subscriptionPlanId: string) {
        let subscriptionPayload = {
            plan_id: subscriptionPlanId,
            application_context: {
                brand_name: "sendwisetool",
                local: "en_US",
                user_action: "SUBSCRIBE_NOW",
                payment_method: {
                    payer_selected: "paypal",
                    payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
                },
                return_url: this.ClIENT_PUBLIC_URL + "v1/subscription/successPayPalPayment",
                cancel_url: this.ClIENT_PUBLIC_URL + "v1/subscription/cancelPayPalPayment"
            }
        };

        return subscriptionPayload;
    }

    // create subscription
    subscribe(subscriptionPlanId: string): Observable<AxiosResponse<any, any>> {
        const subscriptSession = this.httpService.post(this.base + '/v1/billing/subscriptions', JSON.stringify(this.setSubscriptionPayload(subscriptionPlanId)), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.auth
            }
        });

        console.log("\n\n subscriptSession from subscribe", subscriptSession, "\n\n");
        return subscriptSession;
    }

    // get subscription details
    getSubscriptionDetails(subscriptionId: string): Observable<AxiosResponse<any, any>> {
        const subcriptDetails = this.httpService.get(this.base + '/v1/billing/subscriptions/' + subscriptionId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.auth
            }
        });

        console.log("\n\n subcriptDetails from getSubscriptionDetails", subcriptDetails, "\n\n");
        return subcriptDetails;
    }

    // unsubscribe to a plan
    unsubscribe(subscriptionId: string): Observable<AxiosResponse<any, any>> {

        // this is Mock: 
        // TODO: adds a reason to unsubscribe from frontend.
        const payload = {
            "reason": "Not satisfied with the service"
        }

        const unsubResponse = this.httpService.post(this.base + '/v1/billing/subscriptions/' + subscriptionId + '/cancel', JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.auth
            }
        });

        return unsubResponse;
    }

    changPlan(subscriptionId: string, plan_id: string): Observable<AxiosResponse<any, any>> {
        // upgrade the plan
        const upgradeSubscriptionPlan = this.httpService.post(`${this.base}//v1/billing/subscriptions/${subscriptionId}/revise`, {
            "plan_id": plan_id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.auth
            }
        })

        return upgradeSubscriptionPlan;
    }
}
