import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('price_plan')
@ApiBearerAuth('access-token')
@Controller('price_plan')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Post()
  // @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({ status: 201, type: CreatePriceDto, description: 'Created price plan' })
  async create(@Body() createPriceDto: Prisma.Price_planCreateInput) {
    return await this.pricesService.create(createPriceDto);
  }

  @Get()
  async findAll() {
    return await this.pricesService.findAll();
  }

  @Get(':plan_id')
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({ status: 204, type: CreatePriceDto, schema: Prisma.Price_planScalarFieldEnum, content: {}, description: 'successfully fetch a plan' })
  async findOne(@Param('plan_id') plan_id: string) {
    return await this.pricesService.findOne(plan_id);
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
