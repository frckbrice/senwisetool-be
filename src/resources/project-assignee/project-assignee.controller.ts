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
  create(@Body() createProjectAssigneeDto: Prisma.AssigneeCreateInput) {
    return this.projectAssigneeService.create(createProjectAssigneeDto);
  }

  @Get()
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findAll(@Query() query: { agentCode: string }) {
    return this.projectAssigneeService.findAll(query.agentCode);
  }

  // GET ALL SUBACCOUNTS OF A COMPANY
  @Get('perCompany')
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.AUDITOR, Role.IT_SUPPORT)
  findAllSubAccounts(@Query() query: { company_id: string }) {
    return this.projectAssigneeService.findAllSubAccounts(query.company_id)
  }

  @Get(':id')
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.projectAssigneeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateProjectAssigneeDto: UpdateProjectAssigneeDto) {
    return this.projectAssigneeService.update(id, updateProjectAssigneeDto);
  }

  @Delete(':id')
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.projectAssigneeService.remove(id);
  }
}
