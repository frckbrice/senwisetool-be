import { ProjectStatus, TypeProject } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { IsDate, IsEnum, IsJSON, IsNotEmpty, IsString } from "class-validator";
import { ProjectEntity } from "../entities/project.entity";


export class CreateProjectDto implements Partial<ProjectEntity> {
    /**
     * example: dongamantung-project
     * 
     */
    @IsString()
    @IsNotEmpty()
    name: string;

    /**
     * example: dongamantung-project concern the collection of data on cocoa farms for farmer of dungamantung subdivision 
     */
    @IsString()
    @IsNotEmpty()
    description: string;

    /**
     * example startDate: 28-06-2024 
     */
    @IsDate()
    @IsNotEmpty()
    startDate: Date;


    /**
     * example startDate: 28-06-2024 
     */
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    /**
     * example: INTERNAL_INSPECTION
     */

    @IsEnum([TypeProject.INITIAL_INSPECTION, TypeProject.EXTERNAL_INSPECTION, TypeProject.AUTO_EVALUATION, TypeProject.MAPPING])
    @IsNotEmpty()
    type: TypeProject;

    /**
    * example:COCOA
    */
    @IsString()
    sector_activity: string;

    /**
    * example:ARCHIVED
    */
    @IsEnum([ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED, ProjectStatus.DELETED, ProjectStatus.DRAFT])
    @IsNotEmpty()
    status: ProjectStatus;

    /**
    * @example "d8a2b2b8-67ea-4d74-b548-15909c04ccb2"
    */
    @IsString()
    @IsNotEmpty()
    CompanyId: string;

    /**
   * @example {farmer_name: "andrew", company_id: "123456789", location: [122,25666 03,0255444]}
   */
    @IsJSON()
    @IsNotEmpty()
    form_structure: JsonValue
}
