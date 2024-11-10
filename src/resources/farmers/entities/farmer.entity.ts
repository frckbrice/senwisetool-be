import { $Enums, Farmer } from '@prisma/client';

export class FarmerType implements Farmer {
    certification_year: string;
    company_id: string;
    farmer_ID_card_number: string;
    farmer_contact: string;
    farmer_name: string;
    farmer_photos: string[];
    id: string;
    inspection_date: string;
    inspector_contact: string;
    inspector_name: string;
    pesticide_quantity: number;
    pesticide_used: string;
    village: string;
    weed_application: string;
    weed_application_quantity: number;
    council: string;
    created_at: Date;
    updated_at: Date;
    status: $Enums.SubscriptionStatus | null;
}
