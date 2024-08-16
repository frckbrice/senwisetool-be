import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ComapnyService } from './companies.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from "@prisma/client";
import { RolesGuard } from 'src/global/guards/auth.guard';
import { Roles } from 'src/global/guards/roles.decorator';
import { PaginationCompanyQueryDto } from './dto/paginate-company.dto';

// @UseGuards(RolesGuard)
@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: ComapnyService) { }

  @Post()
  @ApiOperation({ summary: 'create project data' })
  create(@Body() createInspectionDatumDto: Prisma.CompanyCreateInput) {
    return this.companyService.create(createInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'find all companies' })
  findAll(@Query() query: PaginationCompanyQueryDto) {
    return this.companyService.findAll(query);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'find one company with its id' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update one company with its id' })
  update(@Param('id') id: string, @Body() updateInspectionDatumDto: Prisma.CompanyUpdateInput) {
    return this.companyService.update(id, updateInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete one company with its id' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
