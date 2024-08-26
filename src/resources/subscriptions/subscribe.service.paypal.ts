import { Injectable } from "@nestjs/common";


// create a subscription in paypal
@Injectable()
export class SubscribeToPayPalService {
    create(createSubscriptionDto: any) {
        return createSubscriptionDto;
    }
}
