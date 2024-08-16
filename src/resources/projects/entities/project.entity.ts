
import { $Enums, Prisma, Project } from "@prisma/client";

export class ProjectEntity implements Project {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    status: $Enums.ProjectStatus;
    type: $Enums.TypeProject;
    form_structure: Prisma.JsonValue;
    sector_activity: string;
}
