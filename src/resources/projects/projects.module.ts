import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Slugify } from 'src/global/utils/slugilfy';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, Slugify],
})
export class ProjectsModule { }
