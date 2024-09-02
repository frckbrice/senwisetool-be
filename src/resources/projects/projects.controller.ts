import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/global/logger/logger.service';
import { Prisma, Role, User } from '@prisma/client';
import { PaginationProjectQueryDto } from './dto/paginate-project.dto';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';

// to handle rate limiting
import { SkipThrottle } from '@nestjs/throttler'
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

@ApiTags('projects')

@UseGuards(RolesGuard)
@SkipThrottle()
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) { }
  private readonly logger = new LoggerService(ProjectsController.name)

  @Post()
  @ApiOperation({ summary: 'create project' })
  @ApiResponse({ status: 201, description: 'The projects has been successfully created.' })
  @Roles(Role.ADG, Role.IT_SUPPORT)
  create(@Body() createProjectDto: Prisma.ProjectCreateInput, @CurrentUser() user: Partial<User>) {
    return this.projectsService.create({ createProjectDto, user_id: <string>user.id });
  }


  @Get()
  @ApiOperation({ summary: 'Find all projects ' })
  @ApiResponse({
    status: 200,
    description: 'The projects has been successfully fetched.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT, Role.AUDITOR)
  findAll(@Query() query: PaginationProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':project_id')
  @ApiOperation({ summary: 'find one project with its Id' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully fetched.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT, Role.AUDITOR)
  findOne(@Param('project_id') project_id: string) {
    return this.projectsService.findOne(project_id);
  }

  @Patch(':project_id')
  @ApiOperation({ summary: 'update one project with its Project_id' })
  @ApiResponse({
    status: 200,  // returned as this resource is again used in front end
    description: 'The project has been successfully updated.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT,)
  @ApiOperation({ summary: 'update one project with its Project_id' })
  update(@Param('project_id') project_id: string, @Body() updateProjectDto: Prisma.ProjectUpdateInput, @CurrentUser() user: Partial<User>) {
    return this.projectsService.update({ id: project_id, updateProjectDto, user_id: <string>user.id });
  }

  @Delete(':project_id')
  @ApiOperation({ summary: 'delete one project with its Project_id' })
  @ApiResponse({
    status: 204, // returned as this resource is no more used in front end
    description: 'The project has been successfully deleted.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT,)
  @ApiOperation({ summary: 'delete one project with its Project_id' })
  remove(@Param('project_id') project_id: string) {
    return this.projectsService.remove(project_id);
  }


}
