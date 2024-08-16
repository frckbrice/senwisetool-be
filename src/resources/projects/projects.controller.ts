import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/global/logger/logger.service';
import { Prisma, Role } from '@prisma/client';
import { PaginationProjectQueryDto } from './dto/paginate-project.dto';
import { Roles } from 'src/global/guards/roles.decorator';
import { RolesGuard } from 'src/global/guards/auth.guard';

// to handle rate limiting
import { Throttle, SkipThrottle } from '@nestjs/throttler'


@ApiTags('projects')
@Roles(Role.ADG)
@UseGuards(RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  private readonly logger = new LoggerService(ProjectsController.name)

  @Post()
  @ApiOperation({ summary: 'create project' })
  create(@Body() createProjectDto: Prisma.ProjectCreateInput) {
    return this.projectsService.create(createProjectDto);
  }

  @SkipThrottle({ default: false })
  @Get()
  @ApiOperation({ summary: 'Find all projects ' })
  findAll(@Query() query: PaginationProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'find one project with its Id' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one project with its Id' })
  update(@Param('id') id: string, @Body() updateProjectDto: Prisma.ProjectUpdateInput) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one project with its Id' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // TODO: create endpoint to store inspection_data
}
