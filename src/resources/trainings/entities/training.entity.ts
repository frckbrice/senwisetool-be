import { Training } from "@prisma/client";
export class TrainingEntity implements Training {
    company_id: string;
    created_at: Date;
    end_date: Date;
    id: string;
    location: string;
    modules: string[];
    report_url: string;
    start_date: Date;
    title: string;
    trainer_proof_of_competency: string[];
    training_attendance_sheet_url: string[];
    training_picture_url: string[];
    updated_at: Date;
    slug: string;
}
