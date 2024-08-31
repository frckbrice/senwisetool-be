import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('price_plans')
@ApiBearerAuth('access-token')
@Controller('price_plans')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Post()
  // @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({ status: 201, type: CreatePriceDto, description: 'Created price plan' })
  async create(@Body() createPriceDto: Prisma.Price_planCreateInput) {
    console.log("\n\ncreate plan request")
    return await this.pricesService.create(createPriceDto);
  }

  @Get()
  async findAll() {
    return await this.pricesService.findAll();
  }

  @Get(':plan_name')
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({ status: 200, type: CreatePriceDto, schema: Prisma.Price_planScalarFieldEnum, content: {}, description: 'successfully fetch a plan' })
  async findOne(@Param('plan_name') plan_name: string) {
    return await this.pricesService.findOne(plan_name);
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
