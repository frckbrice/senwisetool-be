import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { InspectionDataService } from './inspection_data.service';
import { CreateInspectionDatumDto } from './dto/create-inspection_datum.dto';
import { UpdateInspectionDatumDto } from './dto/update-inspection_datum.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, Role } from "@prisma/client";
import { RolesGuard } from 'src/global/guards/auth.guard';
import { Roles } from 'src/global/guards/roles.decorator';


@ApiTags('inspection_data')
@Controller('inspection_data')
export class InspectionDataController {
  constructor(private readonly inspectionDataService: InspectionDataService) { }

  @Post()
  @ApiOperation({ summary: 'create project data' })
  create(@Body() createInspectionDatumDto: Prisma.Inspection_dataCreateInput) {
    return this.inspectionDataService.create(createInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'find all inspection data' })
  findAll(@Query() query: { projectId: string, page?: number, perPage?: number }) {
    return this.inspectionDataService.findAll(query);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'find one inspection data whit its id' })
  findOne(@Param('id') id: string) {
    return this.inspectionDataService.findOne(id);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update one inspection data whit its id' })
  update(@Param('id') id: string, @Body() updateInspectionDatumDto: Prisma.Inspection_dataUpdateInput) {
    return this.inspectionDataService.update(id, updateInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete one inspection data whit its id' })
  remove(@Param('id') id: string) {
    return this.inspectionDataService.remove(id);
  }
}
