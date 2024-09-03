import { $Enums, Company } from "@prisma/client";
export class CompanyType {
    /**
     * example: name: "senima "
     */
    name: string;
    /**
     *  example country: canada
     */
    country: string;
    /**
     * example: "senima@abstract.com"
     */
    email: string;
    /**
     * example: "http://senima@abstract.com/logo.png | local logo.png"
     */
    logo: string;
    /**
     * example: "paypal"
     */
    payment_mode: string;
    /**
     * example: "senima@abstract.com"
     */
    company_paypal_email: string;
    /**
     * example: "cm0mr7v3e00013v0kv3esu8jv"
     */
    paypal_id: string | null;
    /**
     * example: "IT"
     */
    sector_of_activity: string;
    /**
     * example: "Canada"
     */
    address: string;
    /**
     * example: "Canada"
     */
    city: string;
    /**
     * example: "some description"
     */
    description: string;
    /**
     * example: "123-456-7890"
     */
    phone_number: string;
    /**
     * example: "ACTIVE | INACTIVE | SUSPENDED"
     */
    status: $Enums.CompanyStatus | null;
}
