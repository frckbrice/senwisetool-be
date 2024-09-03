import { training_session } from "@prisma/client";

export class TrainingSession implements training_session {
    created_at: Date;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    phone: string;
    role: string;
    signature: string;
    training_id: string;
    updated_at: Date;
    report_url: string;
    trainer_proof_of_competency: string[];
    training_attendance_sheet_urls: string[];
    training_picture_url: string[];
}
