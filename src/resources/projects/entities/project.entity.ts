
import { $Enums, Prisma, Project } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export class ProjectEntity implements Project {
    id: string;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    company_id: string;
    created_at: Date;
    updated_at: Date;
    status: $Enums.ProjectStatus;
    type: $Enums.TypeProject;
    form_structure: Prisma.JsonValue;
    sector_activity: string;
    slug: string;
    title: string;
    country: string;
    project_structure: JsonValue;
    archived: boolean;
    archived_at: Date;
    deleted_at: Date;
    draft: boolean;
    draft_at: Date;

}
