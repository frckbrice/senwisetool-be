import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InspectionDataService } from './inspection_data.service';
import { CreateInspectionDatumDto } from './dto/create-inspection_datum.dto';
import { UpdateInspectionDatumDto } from './dto/update-inspection_datum.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inspection_data')
@Controller('inspection_data')
export class InspectionDataController {
  constructor(private readonly inspectionDataService: InspectionDataService) { }

  @Post()
  create(@Body() createInspectionDatumDto: CreateInspectionDatumDto) {
    return this.inspectionDataService.create(createInspectionDatumDto);
  }

  @Get()
  findAll() {
    return this.inspectionDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInspectionDatumDto: UpdateInspectionDatumDto) {
    return this.inspectionDataService.update(+id, updateInspectionDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionDataService.remove(+id);
  }
}
