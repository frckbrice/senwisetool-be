import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('prices')
@ApiBearerAuth('access-token')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Post()
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({ status: 201, type: CreatePriceDto, schema: Prisma.Price_planScalarFieldEnum, content: {}, description: 'Created price plan' })
  create(@Body() createPriceDto: Prisma.Price_planCreateInput) {
    return this.pricesService.create(createPriceDto);
  }

  @Get()
  findAll() {
    return this.pricesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.pricesService.update(+id, updatePriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricesService.remove(+id);
  }
}
