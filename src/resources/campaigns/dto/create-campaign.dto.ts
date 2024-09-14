import { Campaign } from "@prisma/client";

export class CreateCampaignDto {
    /**
     * example: description: 
     */
    description: string;
    end_date: Date;
    /**
     * example: name= "2023-2024" . Note this could change later to name = april 2024
     */
    name: string;
    start_date: Date;
    status: string;
}
