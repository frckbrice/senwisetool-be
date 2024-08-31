import { isString, isNotEmpty, IsString, IsNotEmpty } from "class-validator";

export class CreateSubscriptionDto {

    /**
     * example plan_id: P-7Z754QH5RSJFBK
     */
    @IsString()
    @IsNotEmpty()
    plan_id: string = <string>process.env.PAYPAL_SILVER_PLAN_ID;

    /**
     * example company_id: company_1:1526654ds4ds5ds55
     */
    @IsString()
    @IsNotEmpty()
    company_id: string
}
