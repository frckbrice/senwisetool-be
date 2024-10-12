import { Module } from '@nestjs/common';
import { ProjectAssigneeService } from './project-assignee.service';
import { ProjectAssigneeController } from './project-assignee.controller';

@Module({
  controllers: [ProjectAssigneeController],
  providers: [ProjectAssigneeService],
  exports: [ProjectAssigneeService]
})
export class ProjectAssigneeModule { }
