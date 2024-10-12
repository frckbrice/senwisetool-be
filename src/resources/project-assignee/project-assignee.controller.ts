import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectAssigneeService } from './project-assignee.service';
import { UpdateProjectAssigneeDto } from './dto/update-project-assignee.dto';
import { Prisma, Role } from '@prisma/client';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';


@Controller('project_assignee')
@ApiTags('project_assignee')
export class ProjectAssigneeController {
  constructor(private readonly projectAssigneeService: ProjectAssigneeService) { }

  @Post()
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get(':id')
  create(@Body() createProjectAssigneeDto: Prisma.AssigneeCreateInput) {
    return this.projectAssigneeService.create(createProjectAssigneeDto);
  }

  @Get()
  @Post()
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findAll(@Query() query: { agent_code: string }) {
    return this.projectAssigneeService.findAll(query.agent_code);
  }

  @Get(':id')
  @Post()
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.projectAssigneeService.findOne(id);
  }

  @Patch(':id')
  @Post()
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateProjectAssigneeDto: UpdateProjectAssigneeDto) {
    return this.projectAssigneeService.update(id, updateProjectAssigneeDto);
  }

  @Delete(':id')
  @Post()
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.projectAssigneeService.remove(id);
  }
}
