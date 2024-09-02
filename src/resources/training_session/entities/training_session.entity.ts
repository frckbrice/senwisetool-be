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
}
