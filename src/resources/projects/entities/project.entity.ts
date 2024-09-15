import { $Enums, Prisma, Project } from '@prisma/client';

export class ProjectEntity implements Project {
  id: string;
  type: $Enums.TypeProject;
  company_id: string;
  title: string;
  description: string;
  sector_activity: string;
  country: string;
  status: $Enums.ProjectStatus;
  start_date: Date;
  end_date: Date;
  project_structure: Prisma.JsonValue;
  archived: boolean;
  draft: boolean;
  state: string;
  city: string;
  archived_at: Date;
  draft_at: Date;
  created_at: Date;
  deleted_at: Date;
  slug: string;
  updated_at: Date;
  deployed_at: Date;
}
