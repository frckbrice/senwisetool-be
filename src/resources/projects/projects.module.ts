import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Slugify } from 'src/global/utils/slugilfy';
// import { ProjectInvitationService } from './projects.invitation';
import { ProjectAssigneeModule } from '../project-assignee/project-assignee.module';

@Module({
  imports: [ProjectAssigneeModule],
  controllers: [ProjectsController],
  providers: [

    ProjectsService,

    Slugify,
    // ProjectInvitationService
  ],
})
export class ProjectsModule { }
