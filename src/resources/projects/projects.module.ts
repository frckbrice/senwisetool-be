import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Slugify } from 'src/global/utils/slugilfy';
// import { ProjectInvitationService } from './projects.invitation';

@Module({
  controllers: [ProjectsController],
  providers: [

    ProjectsService,

    Slugify,
    // ProjectInvitationService
  ],
})
export class ProjectsModule { }
