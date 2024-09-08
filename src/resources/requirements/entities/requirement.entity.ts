import { Prisma, Requirement } from "@prisma/client";

export class RequirementType implements Requirement {
    content: Prisma.JsonValue;
    created_at: Date;
    id: string;
    name: string;
    updated_at: Date;
}
