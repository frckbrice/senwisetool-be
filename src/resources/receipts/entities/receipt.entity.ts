import { Prisma, Receipt } from "@prisma/client";

export class ReceiptType implements Receipt {
    agent_name: string;
    agent_signature: string;

    currency: string;

    farmer_signature: string;

    humidity: string;
    id: string
    market: Prisma.MarketCreateNestedOneWithoutReceiptsInput;
    net_weight: number;
    price_per_kg: string;

    product_name: string;
    refraction: string;

    total_price: number;
    total_weight: string;
    village: string;
    weight: string;
    created_at: Date;
    date: Date;
    farmer_id: string;
    gpsLocation: Prisma.JsonValue;
    market_id: string;
    salePhotoUrl: string[];
    updated_at: Date;

}
