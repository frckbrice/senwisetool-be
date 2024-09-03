import { Training } from "@prisma/client";
export class TrainingEntity implements Training {
    company_id: string;
    created_at: Date;
    end_date: Date;
    id: string;
    location: string;
    modules: string[];
    start_date: Date;
    title: string;
    updated_at: Date;
    slug: string;
}
